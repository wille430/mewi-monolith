import {
    ListingOrigin,
    ScraperStatus,
    stringSimilarity,
    ScraperTrigger,
    Category,
} from '@wille430/common'
import crypto from 'crypto'
import { CreateConfigFunction } from './types/CreateConfigFunction'
import { BaseEntryPoint } from './BaseEntryPoint'
import { ScrapedListing } from './types/ScrapedListing'
import { WatchOptions } from './types/WatchOptions'
import { StartScraperOptions } from '../types/startScraperOptions'
import { ConfigService } from '@nestjs/config'
import { DefaultStartOptions } from '../types/defaultStartOptions'
import { scraperStopFunction } from '../helpers/scraperStopFunction'
import { ListingsRepository } from '@/listings/listings.repository'
import { FilterQuery } from 'mongoose'
import { UserDocument } from '@/schemas/user.schema'

export abstract class BaseListingScraper {
    status: ScraperStatus = ScraperStatus.IDLE
    useRobots = true
    verbose = false
    initialized = false

    abstract limit: number
    abstract readonly baseUrl: string
    abstract readonly origin: ListingOrigin
    abstract entryPoints: BaseEntryPoint[]
    abstract createScrapeUrl: (...args: any) => string

    abstract listingsRepository: ListingsRepository
    abstract config: ConfigService

    readonly watchOptions: WatchOptions = {
        findFirst: 'date',
    }
    readonly deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000

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

    getConfig<T>(key: string) {
        return (
            this.config.get<T>(`scraper.${this.origin}.${key}`) ??
            this.config.get<T>(`scraper.default.${key}`)
        )
    }

    async start(_options: Partial<StartScraperOptions> = this.defaultStartOptions) {
        if (!this.initialized) await this.initialize()

        const options = {
            triggeredBy: ScraperTrigger.Scheduled,
            scrapeCount: this.getConfig<number>('limit'),
            ...this.defaultStartOptions,
        }

        Object.assign(options, _options)

        const { watchOptions, scrapeCount } = options

        this.status = ScraperStatus.SCRAPING

        let batch: ScrapedListing[] = []
        let totalScrapedCount = 0

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
            process.stdout.write(
                `Scraping ${maxScrapeCount ? maxScrapeCount : ''} listings from ${
                    (await entryPoint.createConfig(1)).url
                } `
            )

            let findIndex = scraperStopFunction(watchOptions.findFirst, findIndexValue)

            // This block is only used for logging
            if (findIndexValue) {
                if (watchOptions?.findFirst === 'date') {
                    process.stdout.write(`created after ${findIndexValue}`)
                } else if (options.watchOptions?.findFirst === 'origin_id') {
                    process.stdout.write(`until listing with origin_id ${findIndexValue} is found`)
                }
            } else {
                process.stdout.write('until last page or max scrape count reached')
            }
            process.stdout.write('\n')

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

                this.log(`Deleting listings in case duplicates are found`)
                await this.listingsRepository.deleteMany({
                    origin_id: { $in: batch.map((x) => x.origin_id) },
                })

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

            totalScrapedCount += targetScrapeCount
            if (options.onNextEntryPoint) options.onNextEntryPoint()

            this.log(
                `Scraping of entrypoint ${entryPoint.identifier} complete. Deleting old listings and creating log...`
            )

            await this.deleteOldListings({
                entryPoint: entryPoint.identifier,
            })

            // await this.listingsRepository.scrapingLog.create({
            //     data: {
            //         added_count: totalScrapedCount,
            //         // TODO: correct error count value
            //         error_count: 0,
            //         entryPoint: entryPoint.identifier,
            //         scrapeToDate: scrapeToValue instanceof Date ? scrapeToValue : undefined,
            //         scrapeToId: typeof scrapeToValue === 'string' ? scrapeToValue : undefined,
            //         target: this.origin,
            //         triggered_by: options.triggeredBy,
            //     },
            // })
        }

        this.log('DONE')

        this.reset()
    }

    private async deleteOldListings(args: FilterQuery<UserDocument> = {}): Promise<void> {
        await this.listingsRepository.deleteMany({
            date: {
                lte: new Date(this.deleteOlderThan),
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
        let completeMessage = `[${this.origin}]: ${message}`
        if (process.env.NODE_ENV === 'development' || this.verbose) {
            if (linebreak) console.log(completeMessage)
            else process.stdout.write(completeMessage)
        }
    }

    reset(): void {
        this.status = ScraperStatus.IDLE
    }

    stringToCategoryMap: Record<string, Category> = {}
    parseCategory(_string: string): Category {
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

    getTotalPages(arg: any): number | undefined {
        return undefined
    }
}
