import { Category, ListingOrigin, ScraperTrigger } from '@/common/schemas'
import type { FilterQuery } from 'mongoose'
import crypto from 'crypto'
import type { CreateConfigFunction } from './types/CreateConfigFunction'
import type { BaseEntryPoint } from './BaseEntryPoint'
import type { ScrapedListing } from './types/ScrapedListing'
import type { WatchOptions } from './types/WatchOptions'
import type { StartScraperOptions } from '../types/startScraperOptions'
import type { DefaultStartOptions } from '../types/defaultStartOptions'
import { scraperStopFunction } from '../helpers/scraperStopFunction'
import type { ScrapingLogsRepository } from '../scraping-logs.repository'
import type { ListingsRepository } from '../../listings/listings.repository'
import type { UserDocument } from '../../schemas/user.schema'
import { ScraperStatus } from '@/common/types'
import { stringSimilarity } from '@/lib/utils/stringUtils'
import { scrapersConfig } from '../scrapers.config'
import { ScraperOptions } from '../../common/types/scraperOptions'

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

    readonly watchOptions: WatchOptions = {
        findFirst: 'date',
    }

    defaultStartOptions: DefaultStartOptions = {
        watchOptions: {
            findFirst: 'date',
        },
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return
        }

        this.initialized = true
    }

    config: ScraperOptions = scrapersConfig['default']

    async start(_options: Partial<StartScraperOptions> = this.defaultStartOptions) {
        if (!this.initialized) await this.initialize()

        const options = {
            triggeredBy: ScraperTrigger.Scheduled,
            scrapeCount: this.config.limit,
            ...this.defaultStartOptions,
        }

        Object.assign(options, _options)

        const { watchOptions, scrapeCount } = options

        this.status = ScraperStatus.SCRAPING

        let batch: ScrapedListing[] = []

        this.log(`Scraping listings from ${this.entryPoints.length} entry points`)
        for (const entryPoint of this.entryPoints) {
            let shouldContinue = true
            let targetScrapeCount = 0
            let maxScrapeCount = scrapeCount
                ? Math.floor(scrapeCount / this.entryPoints.length)
                : undefined
            let scrapeToValue: string | Date | undefined

            const recentLog = await entryPoint.getMostRecentLog()
            let findIndexValue: string | Date | undefined

            const findFirst = watchOptions?.findFirst
            if (findFirst === 'date' && recentLog?.scrapeToDate) {
                findIndexValue = recentLog.scrapeToDate.toString()
            } else if (findFirst === 'origin_id' && recentLog?.scrapeToId) {
                findIndexValue = recentLog.scrapeToId.toString()
            }

            let totalPageCount: number | undefined

            // Compose log
            this.log('', false)
            this.verbose &&
                process.stdout.write(
                    `Scraping ${maxScrapeCount ? maxScrapeCount : ''} listings from ${
                        (await entryPoint.createConfig(1)).url
                    } `
                )

            const findIndex = scraperStopFunction(watchOptions.findFirst, findIndexValue)

            // This block is only used for logging
            if (findIndexValue) {
                if (watchOptions?.findFirst === 'date') {
                    this.verbose && process.stdout.write(`created after ${findIndexValue}`)
                } else if (options.watchOptions?.findFirst === 'origin_id') {
                    this.verbose &&
                        process.stdout.write(
                            `until listing with origin_id ${findIndexValue} is found`
                        )
                }
            } else {
                this.verbose && process.stdout.write('until last page or max scrape count reached')
            }
            this.verbose && process.stdout.write('\n')

            let page = 1
            while (shouldContinue) {
                this.log(`Scraping page ${page}/${totalPageCount ?? '?'}...`)

                const {
                    listings,
                    continue: cont,
                    maxPages,
                } = await entryPoint.scrape(page, {
                    findIndex,
                    maxScrapeCount,
                })

                if (page == 1 && listings.length > 0) {
                    scrapeToValue =
                        listings[0][
                            watchOptions?.findFirst ??
                                this.defaultStartOptions.watchOptions.findFirst
                        ]
                }

                totalPageCount = maxPages
                page += 1

                batch = listings
                shouldContinue = cont

                const deleteCount = await this.listingsRepository.deleteMany({
                    origin_id: { $in: batch.map((x) => x.origin_id) },
                })
                this.log(`Deleted ${deleteCount} listing duplicates`)

                this.log(`Inserting ${batch.length} listings into database`)

                // 1.5 Add the scraped listings
                if (batch.length) {
                    const { count } = await this.listingsRepository.createMany(
                        batch.map((o) => ({ ...o, entryPoint: entryPoint.identifier }))
                    )
                    targetScrapeCount += count

                    if (maxScrapeCount) maxScrapeCount -= count
                }

                if (totalPageCount && page > totalPageCount) {
                    this.log(
                        'Scraper exceeded the total page count. Stopping scraper on this entry point.'
                    )
                    shouldContinue = false
                }
            }

            if (options.onNextEntryPoint) options.onNextEntryPoint()

            this.log(
                `Scraping of entrypoint ${entryPoint.identifier} complete. Deleting old listings and creating log...`
            )

            await this.deleteOldListings({
                entryPoint: entryPoint.identifier,
            })

            await this.scrapingLogsRepository.create({
                added_count: targetScrapeCount,
                // TODO: correct error count value
                error_count: 0,
                entryPoint: entryPoint.identifier,
                scrapeToDate: scrapeToValue instanceof Date ? scrapeToValue : undefined,
                scrapeToId: typeof scrapeToValue === 'string' ? scrapeToValue : undefined,
                target: this.origin,
                triggered_by: options.triggeredBy,
            })
        }

        this.log('DONE')

        this.reset()
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
