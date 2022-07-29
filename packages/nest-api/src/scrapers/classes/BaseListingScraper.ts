import { ScraperStatus, stringSimilarity } from '@wille430/common'
import { ListingOrigin, Category, ScraperTrigger } from '@mewi/prisma'
import { PrismaService } from '@/prisma/prisma.service'
import crypto from 'crypto'
import { StartScraperOptions } from '../types/startScraperOptions'
import { interval, map, merge } from 'rxjs'
import {
    BaseEntryPoint,
    CreateConfigFunction,
    EntryPoint,
    GetTotalPagesFunction,
    ScrapeTargetType,
} from './EntryPoint'
import { WatchOptions, GetBatchOptions, GetBatchReturnObj, ScrapedListing } from './ListingScraper'

export abstract class BaseListingScraper<T extends ScrapeTargetType> {
    status: ScraperStatus = ScraperStatus.IDLE
    useRobots: boolean = true
    verbose = false

    abstract limit: number
    abstract readonly baseUrl: string
    abstract readonly origin: ListingOrigin
    abstract entryPoints: BaseEntryPoint<T>[]
    abstract createScrapeUrl: (...args: any) => string

    abstract prisma: PrismaService

    readonly watchOptions: WatchOptions = {
        findFirst: 'date',
    }
    readonly deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000

    defaultStartOptions: Partial<StartScraperOptions> = {
        watchOptions: {
            findFirst: 'date',
        },
    }

    abstract getBatch(options?: GetBatchOptions<T>): GetBatchReturnObj

    async start(options: Partial<StartScraperOptions> = {}) {
        options = {
            triggeredBy: ScraperTrigger.Scheduled,
            ...this.defaultStartOptions,
            ...options,
        }

        this.status = ScraperStatus.SCRAPING

        let batch: ScrapedListing[] = []
        let totalScrapedCount = 0

        this.log(`Scraping listings from ${this.entryPoints.length} entry points`)
        for (const entryPoint of this.entryPoints) {
            let shouldContinue = true
            let scrapeCount = 0
            let maxScrapeCount = options.scrapeCount
                ? Math.floor(options.scrapeCount / this.entryPoints.length)
                : undefined

            const getMostRecentListing = await entryPoint.getMostRecentListing()
            let findIndexValue = getMostRecentListing
                ? getMostRecentListing[options.watchOptions.findFirst]
                : undefined

            let totalPageCount: number | undefined

            const handleTotalPageCount = (pages: number) => (totalPageCount = pages)

            this.log(
                `Scraping ${maxScrapeCount ? `${maxScrapeCount}` : ''} listings from ${
                    (await entryPoint.createConfig(1)).url
                }`
            )

            let findIndex = undefined
            if (options.watchOptions.findFirst === 'date') {
                this.log(`Scraping listings created after ${findIndexValue}`)
                findIndex = (o) =>
                    new Date(o.date).getTime() <=
                    ((findIndexValue as Date) ?? new Date(0)).getTime()
            } else if (options.watchOptions.findFirst === 'origin_id') {
                this.log(`Stopping scraping when finding listing with origin_id ${findIndexValue}`)
                findIndex = (o) => o.origin_id === findIndexValue
            }

            let page = 1
            while (shouldContinue) {
                this.log(`Scraping page ${page}/${totalPageCount ?? '?'}...`)
                let { listings, continue: cont } = await this.getBatch({
                    maxScrapeCount,
                    findIndex,
                    entryPoint,
                    page,
                    onTotalPageCount:
                        totalPageCount === undefined ? handleTotalPageCount : undefined,
                })
                page += 1

                batch = listings
                shouldContinue = cont

                this.log(`Deleting listings in case duplicates are found`)
                await this.prisma.listing.deleteMany({
                    where: {
                        origin_id: { in: batch.map((x) => x.origin_id) },
                    },
                })

                this.log(`Inserting ${batch.length} listings into database`)

                // 1.5 Add the scraped listings
                if (batch.length) {
                    const { count } = await this.prisma.listing.createMany({
                        data: batch.map((o) => ({ ...o, entryPoint: entryPoint.identifier })),
                    })
                    scrapeCount += count
                    maxScrapeCount -= count
                }

                if (totalPageCount && page > totalPageCount) {
                    this.log(
                        'Scraper exceeded the total page count. Stopping scraper on this entry point.'
                    )
                    shouldContinue = false
                }
            }

            totalScrapedCount += scrapeCount

            // Set date to
        }

        this.log('Scraping complete. Deleting old listings...')
        await this.deleteOldListings()
        this.log('DONE')

        this.reset()
    }

    private async deleteOldListings(): Promise<void> {
        await this.prisma.listing.deleteMany({
            where: {
                date: {
                    lte: new Date(this.deleteOlderThan),
                },
            },
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

    log(message: string) {
        if (process.env.NODE_ENV === 'development' || this.verbose) {
            console.log(`[${this.origin}]: ${message}`)
        }
    }

    reset(): void {
        this.status = ScraperStatus.IDLE
    }

    async watchDelay() {
        const minutesToFillLimit = this.limit / (await this.getListingsAddedAverage())
        let delay = minutesToFillLimit * 0.8 * 60 * 1000 + Math.floor(Math.random() * 10000)

        delay = process.env.NODE_ENV === 'development' ? 20 * 1000 : Math.min(delay, 15 * 60 * 1000)

        return delay
    }

    _listingsAddedAverage: number | undefined
    /**
     * Calculate how many listings are added per minute (average)
     *
     * @param daySpan Over how many days to calculate the average
     * @returns Listings/minute
     */
    async getListingsAddedAverage(daySpan = 7): Promise<number> {
        if (this._listingsAddedAverage) return this._listingsAddedAverage

        const listingCountSince = await this.prisma.listing.count({
            where: {
                date: {
                    gte: new Date(Date.now() - daySpan * 24 * 60 * 60 * 1000),
                },
                origin: this.origin,
            },
        })

        const avg = listingCountSince / (daySpan * 24 * 60)
        this._listingsAddedAverage = avg

        return avg
    }

    async createWatchFunction(entryPoint: BaseEntryPoint<T>, index: number) {
        // Get the value where getBatch will stop scraping
        let stopAtValue: ScrapedListing[typeof this.watchOptions['findFirst']] | undefined =
            await this.getBatch({
                maxScrapeCount: 1,
                entryPoint,
                page: 1,
            }).then((o) =>
                o.listings.length ? o.listings[0][this.watchOptions.findFirst] : undefined
            )

        if (!stopAtValue) {
            throw new Error(
                `[${this.origin}]: Could not determine value to stop scraping. Target ${this.baseUrl} might be down.`
            )
        }

        let delay = (1 + index / this.entryPoints.length) * (await this.watchDelay())
        this.log(
            `Watching for new listings and stopping at ${
                this.watchOptions.findFirst
            } ${stopAtValue} every ${Math.ceil(delay / 1000)} seconds...`
        )

        this.reset()
        return interval(delay).pipe(
            map((val) => async () => {
                let shouldContinue: boolean = false
                let tempStopAtValue = stopAtValue
                let i = 0

                do {
                    this.log(`Scraping ${entryPoint.identifier}...`)
                    const { listings, ...rest } = await this.getBatch({
                        entryPoint,
                        page: i + 1,
                        findIndex: (val) => {
                            if (this.watchOptions.findFirst === 'date') {
                                return (
                                    new Date(val[this.watchOptions.findFirst]).getTime() <=
                                    new Date(tempStopAtValue).getTime()
                                )
                            } else {
                                return val[this.watchOptions.findFirst] === tempStopAtValue
                            }
                        },
                    })

                    // The first iteration should return the stop value of the first listing
                    if (i === 0) {
                        stopAtValue =
                            listings.length > 0
                                ? listings[0][this.watchOptions.findFirst]
                                : stopAtValue

                        this.log(`New stop value: ${stopAtValue}`)
                    }

                    if (!shouldContinue) {
                        this.log(
                            `Found ${listings.length} new listings. Retrying again in ${Math.ceil(
                                delay / 1000
                            )} seconds...`
                        )
                    } else {
                        this.log(`Found ${listings.length} new listings. Fetching next page...`)
                    }

                    // Insert listings to database
                    if (listings.length)
                        await this.prisma.listing.createMany({
                            data: listings,
                        })

                    i += 1
                    shouldContinue = rest.continue
                } while (shouldContinue === true)
                this.reset()
            })
        )
    }

    async watch() {
        const funcs = await Promise.all(
            this.entryPoints.map((createUrl, i) => this.createWatchFunction(createUrl, i))
        )

        if (this.entryPoints.length === 0) {
            throw new Error(
                'No watcher entry points set. Please set watcherEntryPoints in options.'
            )
        }

        return merge(...funcs).subscribe((val) => val())
    }

    public async createGetBatchReturn(
        arr: ScrapedListing[],
        options: GetBatchOptions<T>
    ): GetBatchReturnObj {
        if (options.findIndex) {
            const index = arr.findIndex(options.findIndex)
            if (index >= 0) {
                this.log(`Found ${arr[index].origin_id} at index ${index}`)
                return {
                    listings: arr.slice(0, index),
                    continue: false,
                    reason: 'MATCH_FOUND',
                }
            }
        }

        if (options.maxScrapeCount && arr.length > options.maxScrapeCount) {
            return {
                listings: arr.splice(0, options.maxScrapeCount),
                continue: false,
                reason: 'MAX_COUNT',
            }
        }

        return {
            listings: arr,
            continue: arr.length > 0,
        }
    }

    stringToCategoryMap: Record<string, Category> = {}
    parseCategory(string: string): Category {
        if (this.stringToCategoryMap[string]) return this.stringToCategoryMap[string]

        if (Category[string.toUpperCase()]) return string.toUpperCase() as Category

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

    createEntryPoint(
        createConfig: CreateConfigFunction,
        getTotalPages?: GetTotalPagesFunction<T>,
        identifier?: string
    ) {
        if (!this.entryPoints) this.entryPoints = []

        this.entryPoints.push(
            EntryPoint.create(this.prisma, createConfig, getTotalPages, identifier ?? this.origin)
        )
    }
}
