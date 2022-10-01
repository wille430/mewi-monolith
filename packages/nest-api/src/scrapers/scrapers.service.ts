import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ListingOrigin, Prisma, ScraperTrigger } from '@mewi/prisma'
import { ScraperStatus, ScraperStatusReport } from '@wille430/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { StartScraperOptions } from './types/startScraperOptions'
import { RunPipelineEvent } from './events/run-pipeline.event'
import { BaseListingScraper } from './classes/BaseListingScraper'
import Scrapers from './scrapers'
import { ListingsRepository } from '@/listings/listings.repository'
import { ScrapingLogsRepository } from './scraping-logs.repository'

@Injectable()
export class ScrapersService {
    scrapers!: Record<ListingOrigin, BaseListingScraper>
    /**
     * The current index in the scraper pipeline, is null if pipeline is not running
     * @see {@link scraperPipeline}
     */
    pipelineIndex: number | null = null
    startScraperAfterMs = 60 * 60 * 1000
    pipelineQueue: RunPipelineEvent[] = []
    scraperPipeline: [ListingOrigin, Partial<StartScraperOptions>][] = []

    constructor(
        @Inject(ListingsRepository) private listingsRepository: ListingsRepository,
        @Inject(ScrapingLogsRepository) private scrapingLogsRepository: ScrapingLogsRepository,
        @Inject(EventEmitter2) private eventEmitter: EventEmitter2
    ) {
        this.instantiateScrapers()
    }

    instantiateScrapers() {
        this.scrapers = Scrapers.reduce((prev, Scraper) => {
            const scraper = new Scraper(this.listingsRepository, this.eventEmitter)
            prev[scraper.origin] = scraper
            return prev
        }, {} as typeof this.scrapers)
    }

    logPipeline(total: number, msg: string) {
        console.log(`[${this.pipelineIndex}/${total}] ${msg}`)
    }

    @OnEvent('pipeline.run')
    async handlePipelineRunEvent(payload: RunPipelineEvent) {
        if (this.pipelineIndex != null) {
            // Push to queue if pipeline is already running
            this.pipelineQueue.push(payload)
            return
        }

        this.pipelineIndex = 0
        const totalScrapers = this.scraperPipeline.length

        const startScraperNext = async () => {
            const arr = this.scraperPipeline.shift()
            if (!arr)
                throw new Error('startScraperNext: Cannot get next scraper. No scrapers in queue!')

            const [name, args] = arr
            this.pipelineIndex! += 1

            const scraper = this.scrapers[name]

            // Delete old
            // this.logPipeline(totalScrapers, `Deleting old listings from ${name}...`)
            // await scraper.deleteOld()
            scraper.reset()

            // Begin scraping
            this.logPipeline(totalScrapers, `Scraping all listings from ${name}...`)
            await scraper.start()

            this.logPipeline(totalScrapers, `Successfully scraped all listings from ${name}`)

            if (this.scraperPipeline.find((x) => x[0] === scraper.origin))
                scraper.status = ScraperStatus.QUEUED

            this.logPipeline(totalScrapers, `Done!`)
        }

        if (payload.count === -1) {
            // run all
            while (this.pipelineIndex < totalScrapers) {
                await startScraperNext()
            }
        } else {
            while (payload.count > 0 && this.pipelineIndex < totalScrapers) {
                await startScraperNext()
                payload.count -= 1
            }
        }

        this.pipelineIndex = null

        if (this.pipelineQueue.length) {
            console.log('Running next pipeline in queue...')
            this.eventEmitter.emit('pipeline.run', this.pipelineQueue.shift())
        } else {
            console.log('Pipeline queue is empty!')
        }
    }

    @Cron('* */45 * * *')
    async startAll(...args: Parameters<BaseListingScraper['start']>) {
        for (const [name] of Object.entries(this.scrapers)) {
            this.scraperPipeline.push([
                name as ListingOrigin,
                { triggeredBy: ScraperTrigger.Scheduled, ...args },
            ])
        }

        this.eventEmitter.emit('pipeline.run', new RunPipelineEvent())
    }

    async start(
        scraperName: ListingOrigin,
        options: StartScraperOptions = { triggeredBy: ScraperTrigger.Scheduled }
    ): Promise<ScraperStatusReport> {
        const scraper: BaseListingScraper | undefined = this.scrapers[scraperName]

        if (scraper) {
            this.scraperPipeline.push([scraperName, options])
            if (scraper.status !== ScraperStatus.SCRAPING) scraper.status = ScraperStatus.QUEUED

            this.eventEmitter.emit('pipeline.run', new RunPipelineEvent())

            const status = await this.statusOf(scraperName)
            status.started = true

            return status
        } else {
            throw new NotFoundException({
                statusCode: 404,
                message: [`no scraper named ${scraperName}`],
                error: 'Not Found',
            })
        }
    }

    private scraperIndex!: number
    /**
     * Call start method on the next scraper. Decorated with cronjob to execute start method on a scraper every 5 minutes.
     */
    @Cron('* */5 * * *')
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
    }

    /**
     * Find the index of the last scraped scraper.
     *
     * @returns Index of the last scraped scraper. Returns 0 if no logs were found.
     */
    private async getLastScrapedIndex() {
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
            listings_remaining: scraper.getConfig<number>('limit') ?? 0 - listingCount,
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

    async getLogs(dto: Prisma.ScrapingLogFindManyArgs) {
        return await this.scrapingLogsRepository.find(dto)
    }

    async resetAll() {
        for (const scraper of Object.values(this.scrapers)) {
            scraper.reset()
        }
    }
}
