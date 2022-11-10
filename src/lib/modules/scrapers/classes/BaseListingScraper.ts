import { Category, ListingOrigin, ScraperTrigger } from '@/common/schemas'
import type { FilterQuery } from 'mongoose'
import crypto from 'crypto'
import type { CreateConfigFunction } from './types/CreateConfigFunction'
import type { BaseEntryPoint } from './BaseEntryPoint'
import type { StartScraperOptions } from '../types/startScraperOptions'
import { scraperStopFunction } from '../helpers/scraperStopFunction'
import type { ScrapingLogsRepository } from '../scraping-logs.repository'
import type { ListingsRepository } from '../../listings/listings.repository'
import type { UserDocument } from '../../schemas/user.schema'
import { ScraperStatus } from '@/common/types'
import { stringSimilarity } from '@/lib/utils/stringUtils'
import { scrapersConfig } from '../scrapers.config'
import { ScraperOptions } from '../../common/types/scraperOptions'
import { Listing } from '../../schemas/listing.schema'
import { ScrapingLog } from '../../schemas/scraping-log.schema'
import { ScrapeOptions } from './types/ScrapeOptions'

export abstract class BaseListingScraper {
    status: ScraperStatus = ScraperStatus.IDLE
    verbose = process.env.NODE_ENV === 'development'
    initialized = false

    abstract limit: number
    abstract readonly baseUrl: string
    abstract readonly origin: ListingOrigin
    abstract entryPoints: BaseEntryPoint[]
    abstract createScrapeUrl: (...args: any) => string

    abstract listingsRepository: ListingsRepository
    abstract scrapingLogsRepository: ScrapingLogsRepository

    config: ScraperOptions = scrapersConfig['default']

    initialize(): BaseListingScraper {
        if (!this.initialized) {
            this.initialized = true
        }
        return this
    }

    private async createScrapePredicate(entryPoint: BaseEntryPoint) {
        const { scrapeStopAt } = this.config
        const recentLog = await entryPoint.getMostRecentLog()
        let predicateVal: any

        if (scrapeStopAt === 'date' && recentLog?.scrapeToDate) {
            predicateVal = recentLog.scrapeToDate.toString()
        } else if (scrapeStopAt === 'origin_id' && recentLog?.scrapeToId) {
            predicateVal = recentLog.scrapeToId.toString()
        }

        return scraperStopFunction(scrapeStopAt, predicateVal)
    }

    async scrape(index: number, page: number) {
        const entryPoint = this.entryPoints[index]

        const maxScrapeCount = Math.floor(this.config.limit / this.entryPoints.length)

        const options: ScrapeOptions = {
            // TODO
            scrapeAmount: maxScrapeCount,
            stopAtPredicate: await this.createScrapePredicate(entryPoint),
        }

        const { listings, ...scrapeRes } = await entryPoint.scrape(page, options)

        const deleteCount = await this.deleteDups(listings)
        this.log(`Deleted ${deleteCount} listing duplicates`)

        await this.listingsRepository.createMany(
            listings.map(
                (listing) => ({ ...listing, entryPoint: entryPoint.identifier } as Listing)
            )
        )

        return {
            futurePred: this.getFuturePredicateValue(page, listings),
            count: listings.length,
            ...scrapeRes,
        }
    }

    async start(_options: Partial<StartScraperOptions> = {}) {
        if (!this.initialized) this.initialize()

        const options = {
            triggeredBy: ScraperTrigger.Scheduled,
            scrapeCount: this.config.limit,
        }
        Object.assign(options, _options)

        this.status = ScraperStatus.SCRAPING

        this.log(`Scraping listings from ${this.entryPoints.length} entry points`)

        let totalCount = 0
        for (let i = 0; i < this.entryPoints.length; i++) {
            const entryPoint = this.entryPoints[i]

            let page = 1
            let shouldScrape = true
            let futurePredVal: string | Date | undefined
            let scrapeCount = 0
            let totalPageCount: number | undefined

            await this.beginScrapeMessage(entryPoint)

            while (shouldScrape) {
                this.log(`Scraping page ${page}/${totalPageCount ?? '?'}...`)
                const {
                    continue: _shouldScrape,
                    futurePred,
                    count,
                    maxPages,
                } = await this.scrape(i, page)

                this.log(`Inserting ${count} listings into database`)

                totalPageCount = maxPages
                shouldScrape = this.shouldScrape(_shouldScrape, totalPageCount, page)
                futurePredVal = futurePred
                page += 1
                scrapeCount += count
            }

            this.config.onNextEntryPoint && this.config.onNextEntryPoint()

            this.log(
                `Scraping of entrypoint ${entryPoint.identifier} complete. Deleting old listings and creating log...`
            )

            await this.deleteOldListings({
                entryPoint: entryPoint.identifier,
            })

            await this.createReport(scrapeCount, entryPoint, futurePredVal, options)
            totalCount += scrapeCount
        }

        this.log('Total scraped: ' + totalCount)

        this.reset()
    }

    private shouldScrape(
        _shouldScrape: boolean,
        totalPageCount: number | undefined,
        page: number
    ): boolean {
        return _shouldScrape && totalPageCount != null && totalPageCount > page
    }

    private async createReport(
        targetScrapeCount: number,
        entryPoint: BaseEntryPoint,
        predicateVal: any,
        options: { triggeredBy: ScraperTrigger; scrapeCount: number }
    ) {
        const report: Partial<ScrapingLog> = {
            addedCount: targetScrapeCount,
            // TODO: correct error count value
            errorCount: 0,
            entryPoint: entryPoint.identifier,
            target: this.origin,
            triggeredBy: options.triggeredBy,
        }

        if (this.config.scrapeStopAt === 'date') {
            report.scrapeToDate = predicateVal
        } else if (this.config.scrapeStopAt === 'origin_id') {
            report.scrapeToId = predicateVal
        }

        await this.scrapingLogsRepository.create(report)
    }

    private getFuturePredicateValue(
        page: number,
        listings: Partial<Listing>[],
        scrapeToValue?: any
    ) {
        if (page == 1 && listings.length > 0) {
            scrapeToValue = listings[0][this.config.scrapeStopAt]
        }
        return scrapeToValue
    }

    private async deleteDups(listings: Partial<Listing>[]) {
        return this.listingsRepository.deleteMany({
            origin_id: { $in: listings.map((x) => x.origin_id) },
        })
    }

    private async beginScrapeMessage(entryPoint: BaseEntryPoint, maxScrapeCount?: number) {
        // Compose log
        this.verbose &&
            this.log(
                `Scraping ${maxScrapeCount ? maxScrapeCount : ''} listings from ${
                    (await entryPoint.createConfig(1)).url
                } `
            )
    }

    async deleteOldListings(args: FilterQuery<UserDocument> = {}): Promise<void> {
        await this.listingsRepository.deleteMany({
            date: {
                $lte: new Date(this.config.deleteOlderThan),
            },
            ...args,
        })
    }

    /**
     * Create an ID from a string
     *
     * @param string - A unique string
     * @returns An unique ID
     */
    createId(string: string) {
        const shasum = crypto.createHash('sha1')
        shasum.update(string)

        return `${this.origin}-${shasum.digest('hex')}`
    }

    log(message: string, linebreak = true) {
        const completeMessage = `[${this.origin}]: ${message}`
        if (this.verbose) {
            if (linebreak) console.log(completeMessage)
            else process.stdout.write(completeMessage)
        }
    }

    reset(): void {
        this.status = ScraperStatus.IDLE
    }

    stringToCategoryMap: Record<string, Category> = {}
    parseCategory(_string: string): Promise<Category> | Category {
        const string = _string.toUpperCase()
        if (this.stringToCategoryMap[string]) return this.stringToCategoryMap[string]

        if (string in Category && Category[string as Category] != null)
            return string.toUpperCase() as Category

        for (const category of Object.values(Category)) {
            const similarity = stringSimilarity(category, string) * 2
            if (similarity >= 0.7) {
                this.stringToCategoryMap[string] = category as Category
                return category as Category
            }
        }

        this.stringToCategoryMap[string] = Category.OVRIGT
        return Category.OVRIGT
    }

    abstract createEntryPoint(createConfig: CreateConfigFunction, identifier?: string): void

    getTotalPages(_args: any): number | undefined {
        return undefined
    }
}
