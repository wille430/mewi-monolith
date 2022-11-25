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
import { ScrapeNextResult } from './dto/scrape-next-result.dto'
import { ScrapeNextQuery } from './dto/scrape-next-query.dto'
import { NotFoundException } from 'next-api-decorators'

@autoInjectable()
export class ScrapersService {
    scrapers!: Record<ListingOrigin, Scraper<Listing>>
    endPoints!: AbstractEndPoint<Listing>[]
    endPointScraperMap!: Record<string, Scraper<Listing>>
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

        this.endPointScraperMap = Object.values(this.scrapers).reduce((prev, scraper) => {
            for (const endPoint of scraper.endPoints) {
                prev[endPoint.getIdentifier()] = scraper
            }
            return prev
        }, {} as typeof this.endPointScraperMap)
    }

    logPipeline(total: number, msg: string) {
        console.log(`[${this.pipelineIndex}/${total}] ${msg}`)
    }

    /**
     * Scrapes the next endpoint
     */
    async scrapeNext({ endpoint }: ScrapeNextQuery = {}): Promise<ScrapeNextResult> {
        if (endpoint && !this.endPointScraperMap[endpoint]) {
            throw new NotFoundException(`There is not endpoint with name ${endpoint}`)
        }

        const nextEndPoint = endpoint
            ? this.endPoints.find((o) => o.getIdentifier() == endpoint)!
            : (await this.getNextEndPoint()) ?? this.endPoints[0]
        const res = await nextEndPoint.scrape({
            page: 1,
        })
        const { entities } = res

        let addedCount = 0

        if (entities.length) {
            const { count } = await this.listingsRepository.createMany(entities)
            addedCount = count
        }

        await this.removeListings(entities.map(({ origin_id }) => origin_id))

        const log = await this.scrapingLogsRepository.create({
            addedCount,
            entryPoint: nextEndPoint.getIdentifier(),
            errorCount: 0,
            origin: this.endPointScraperMap[nextEndPoint.getIdentifier()].origin,
        })

        return {
            scrapingLog: log.toObject(),
            totalCount: await this.listingsRepository.count({
                entryPoint: nextEndPoint.getIdentifier(),
            }),
        }
    }

    private async removeListings(ids: string[]) {
        return this.listingsRepository.deleteMany({
            origin_id: {
                $in: ids,
            },
        })
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
