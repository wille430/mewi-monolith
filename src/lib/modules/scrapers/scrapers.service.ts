import { ListingOrigin } from '@/common/schemas'
import type { FilterQuery } from 'mongoose'
import { autoInjectable, inject } from 'tsyringe'
import Scrapers from './scrapers'
import { ScrapingLogsRepository } from './scraping-logs.repository'
import type { ScrapingLog } from '../schemas/scraping-log.schema'
import { ListingsRepository } from '../listings/listings.repository'
import { Scraper } from './Scraper/Scraper'
import { Listing } from '../schemas/listing.schema'
import { AbstractEndPoint } from './Scraper/EndPoint'

@autoInjectable()
export class ScrapersService {
    scrapers!: Record<ListingOrigin, Scraper<Listing>>
    endPoints!: AbstractEndPoint<Listing>[]
    /**
     * The current index in the scraper pipeline, is null if pipeline is not running
     * @see {@link scraperPipeline}
     */
    pipelineIndex: number | null = null
    startScraperAfterMs = 60 * 60 * 1000

    constructor(
        @inject(ListingsRepository) private listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) private scrapingLogsRepository: ScrapingLogsRepository
    ) {
        this.instantiateScrapers()
    }

    instantiateScrapers() {
        this.scrapers = Scrapers.reduce((prev, Scraper) => {
            const scraper = new Scraper()
            prev[scraper.origin] = scraper
            return prev
        }, {} as typeof this.scrapers)

        this.endPoints = Object.values(this.scrapers).reduce((prev, scraper) => {
            prev.push(...scraper.endPoints)
            return prev
        }, [] as AbstractEndPoint<Listing>[])
    }

    logPipeline(total: number, msg: string) {
        console.log(`[${this.pipelineIndex}/${total}] ${msg}`)
    }

    /**
     * Scrapes the next endpoint
     */
    async scrapeNext(): Promise<void> {
        const nextEndPoint = (await this.getNextEndPoint()) ?? this.endPoints[0]
        const { entities } = await nextEndPoint.scrape(
            {
                page: 1,
            },
            {}
        )

        await this.listingsRepository.createMany(entities)
    }

    /**
     * Find the index of the last scraped scraper.
     *
     * @returns Index of the last scraped scraper. Returns 0 if no logs were found.
     */
    async getNextEndPoint(): Promise<AbstractEndPoint<Listing> | undefined> {
        const log = await this.scrapingLogsRepository.findOne(
            {},
            {
                sort: {
                    createdAt: -1,
                },
            }
        )

        if (!log) {
            return undefined
        }

        const index = this.endPoints.findIndex((o) => o.getIdentifier() == log.entryPoint)
        return this.endPoints[(index + 1) % this.endPoints.length]
    }

    async getLogs(dto: FilterQuery<ScrapingLog>) {
        return await this.scrapingLogsRepository.find(dto)
    }
}
