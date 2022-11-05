import { ListingOrigin, ScraperTrigger } from '@/common/schemas'
import type { FilterQuery } from 'mongoose'
import { NotFoundException } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import type { BaseListingScraper } from './classes/BaseListingScraper'
import Scrapers from './scrapers'
import { ScrapingLogsRepository } from './scraping-logs.repository'
import type { StartScraperOptions } from './types/startScraperOptions'
import type { ScrapingLog } from '../schemas/scraping-log.schema'
import { ListingsRepository } from '../listings/listings.repository'
import { ScraperStatus, ScraperStatusReport } from '@/common/types'
import { scrapersConfig } from './scrapers.config'

@autoInjectable()
export class ScrapersService {
    scrapers!: Record<ListingOrigin, BaseListingScraper>
    /**
     * The current index in the scraper pipeline, is null if pipeline is not running
     * @see {@link scraperPipeline}
     */
    pipelineIndex: number | null = null
    startScraperAfterMs = 60 * 60 * 1000

    scraperQueue: [ListingOrigin, StartScraperOptions][] = []
    scrapePromises: Partial<Record<ListingOrigin, Promise<any>>> = {}

    constructor(
        @inject(ListingsRepository) private listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) private scrapingLogsRepository: ScrapingLogsRepository
    ) {
        this.instantiateScrapers()
    }

    instantiateScrapers() {
        this.scrapers = Scrapers.reduce((prev, Scraper) => {
            const scraper = new Scraper(this.listingsRepository, this.scrapingLogsRepository)
            scraper.config = scrapersConfig[scraper.origin] ?? scrapersConfig['default']
            prev[scraper.origin] = scraper
            return prev
        }, {} as typeof this.scrapers)
    }

    logPipeline(total: number, msg: string) {
        console.log(`[${this.pipelineIndex}/${total}] ${msg}`)
    }

    private addToQueue(origin: ListingOrigin, options: StartScraperOptions) {
        this.scraperQueue.push([origin, options])
    }

    private startScraper = async (origin: ListingOrigin, options: StartScraperOptions) => {
        const scraper = this.scrapers[origin]
        this.pipelineIndex! += 1

        // Delete old
        // this.logPipeline(totalScrapers, `Deleting old listings from ${name}...`)
        // await scraper.deleteOld()
        scraper.reset()

        // Begin scraping
        this.logPipeline(1, `Scraping all listings from ${origin}...`)
        await scraper.start(options)

        this.logPipeline(1, `Successfully scraped all listings from ${origin}`)

        if (this.scraperQueue.find((x) => x[0] === scraper.origin))
            scraper.status = ScraperStatus.QUEUED

        this.logPipeline(1, `Done!`)
    }

    async runQueue() {
        const totalScrapers = this.scraperQueue.length

        // run all
        for (let i = 0; i < totalScrapers; i++) {
            const args = this.scraperQueue.shift()

            if (args) {
                await this.startScraper(...args)
            }
        }
    }

    async startAll(...args: Parameters<BaseListingScraper['start']>) {
        for (const [name] of Object.entries(this.scrapers)) {
            this.addToQueue(name as ListingOrigin, {
                triggeredBy: ScraperTrigger.Scheduled,
                ...args,
            })

            this.scrapers[name as ListingOrigin].status = ScraperStatus.QUEUED
        }

        this.runQueue()

        return this.status()
    }

    async start(
        scraperName: ListingOrigin,
        options: StartScraperOptions = { triggeredBy: ScraperTrigger.Scheduled }
    ): Promise<ScraperStatusReport> {
        const scraper: BaseListingScraper | undefined = this.scrapers[scraperName]

        if (scraper) {
            this.addToQueue(scraperName, options)
            if (scraper.status !== ScraperStatus.SCRAPING) scraper.status = ScraperStatus.QUEUED

            const status = await this.statusOf(scraperName)
            status.started = true

            return status
        } else {
            throw new NotFoundException(`No scraper named ${scraperName}`)
        }
    }

    scraperIndex!: number
    /**
     * Call start method on the next scraper. Decorated with cronjob to execute start method on a scraper every 5 minutes.
     */
    async scrapeNext() {
        if (!this.scraperIndex) {
            this.scraperIndex = await this.getLastScrapedIndex()
        }

        const scraper: BaseListingScraper =
            this.scrapers[Object.keys(this.scrapers)[this.scraperIndex] as ListingOrigin]

        if (scraper.status === ScraperStatus.IDLE) {
            this.scraperIndex += 1
            this.scraperIndex %= Object.keys(this.scrapers).length

            await scraper.start()
        }

        return
    }

    /**
     * Find the index of the last scraped scraper.
     *
     * @returns Index of the last scraped scraper. Returns 0 if no logs were found.
     */
    async getLastScrapedIndex() {
        const log = await this.scrapingLogsRepository.findOne(
            {},
            {
                sort: {
                    createdAt: -1,
                },
            }
        )

        if (!log) {
            return 0
        }

        const scraper = this.scrapers[log.target as ListingOrigin]

        return Object.keys(this.scrapers).findIndex((x) => x === scraper.origin)
    }

    async conditionalScrape() {
        const lastScrape = await this.scrapingLogsRepository.findOne(
            {},
            {
                sort: {
                    createdAt: -1,
                },
            }
        )

        if (!lastScrape) return

        if (Date.now() - lastScrape.createdAt.getTime() > this.startScraperAfterMs)
            await this.startAll()
    }

    async status(): Promise<Record<ListingOrigin, ScraperStatusReport>> {
        const allScraperStatus: Partial<Awaited<ReturnType<typeof this.status>>> = {}

        for (const key of Object.keys(ListingOrigin)) {
            allScraperStatus[key as ListingOrigin] = await this.statusOf(key as ListingOrigin)
        }

        return allScraperStatus as ReturnType<typeof this.status>
    }

    async statusOf(target: ListingOrigin): Promise<ScraperStatusReport> {
        const scraper = this.scrapers[target]

        const listingCount = await this.listingsRepository.count({
            origin: target,
        })

        return {
            started: scraper.status === ScraperStatus.SCRAPING,
            listings_current: listingCount,
            status: scraper.status,
            listings_remaining: (scraper.config.limit ?? 0) - listingCount,
            last_scraped: await this.scrapingLogsRepository
                .findOne(
                    {
                        target: scraper.origin,
                    },
                    {
                        limit: 1,
                        sort: {
                            createdAt: -1,
                        },
                    }
                )
                .then((o) => o?.createdAt ?? undefined),
        }
    }

    async getLogs(dto: FilterQuery<ScrapingLog>) {
        return await this.scrapingLogsRepository.find(dto)
    }

    async resetAll() {
        for (const scraper of Object.values(this.scrapers)) {
            scraper.reset()
        }
    }
}
