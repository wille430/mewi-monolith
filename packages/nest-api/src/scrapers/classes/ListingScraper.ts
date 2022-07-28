import { ScraperStatus, stringSimilarity } from '@wille430/common'
import { ListingOrigin, Prisma, Category, ScraperTrigger } from '@mewi/prisma'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import robotsParser from 'robots-parser'
import { PrismaService } from '@/prisma/prisma.service'
import crypto from 'crypto'
import { StartScraperOptions } from '../types/startScraperOptions'
import { Inject } from '@nestjs/common'
import { interval, map, merge } from 'rxjs'
import { BaseEntryPoint, EntryPoint } from './EntryPoint'
import { ScraperType } from '../enums/scraper-type.enum'

export type ScrapedListing = Prisma.ListingCreateInput

export type PageDetails = {
    url: string
    currentPage: number
    maxPages?: (res: AxiosResponse) => number
    getMostRecentDate: () => Date | undefined
}

export type ListingScraperConstructorArgs = {
    baseUrl: string
    origin: ListingOrigin
    useRobots?: boolean
    verbose?: boolean
    entryPoints?: BaseEntryPoint<any>[]
}

export type GetBatchOptions = {
    maxScrapeCount?: number
    entryPoint: EntryPoint
    page: number
    findIndex?: (
        value: Prisma.ListingCreateInput,
        index: number,
        obj: Prisma.ListingCreateInput[]
    ) => boolean
    onTotalPageCount?: (pages: number) => any
}

export type WatchOptions = {
    findFirst: 'origin_id' | 'date'
}

export interface IBaseListingScraper {
    entryPoints: BaseEntryPoint<any>[]
}

export abstract class ListingScraper<T = 'DOM'> {
    status: ScraperStatus = ScraperStatus.IDLE
    useRobots: boolean = true
    verbose = false

    threshold: number = 0.8
    abstract limit: number

    private readonly defaultStartOptions: StartScraperOptions = {
        triggeredBy: ScraperTrigger.Scheduled,
        scrapeType: 'NEW',
    }

    readonly defaultScrapeUrl: string
    readonly baseUrl: string
    readonly origin: ListingOrigin

    private readonly deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000

    readonly watchOptions: WatchOptions = {
        findFirst: 'date',
    }

    constructor(
        @Inject(PrismaService) readonly prisma: PrismaService,
        props: ListingScraperConstructorArgs
    ) {
        Object.assign(this, props)

        this.parseRawListing = this.parseRawListing.bind(this)
    }

    abstract createScrapeUrl(...args: any): string

    /**
     * Override this function to find the array of unparsed listings
     *
     * @param res Axios Response object
     * @returns An array of objects of unknown shape
     */
    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data as any
    }
    parseRawListing(obj: Record<string, any>): ScrapedListing {
        return obj as any
    }

    async createAxiosInstance(): Promise<AxiosInstance> {
        return axios.create()
    }

    /**
     * Checks whether or not the website allows scraping
     *
     * @returns True if the website allows scraping
     */
    async allowsScraping(): Promise<boolean> {
        // skip if useRobots is false
        if (!this.useRobots) {
            return true
        }

        const robotsTxt = await axios.get(this.baseUrl).then((res) => res.data)

        const robots = robotsParser(new URL('robots.txt', this.baseUrl).toString(), robotsTxt)

        if (robots.isAllowed(this.defaultScrapeUrl)) {
            return true
        } else {
            return false
        }
    }

    async start(options: Partial<StartScraperOptions> = {}) {
        options = {
            ...this.defaultStartOptions,
            ...options,
        }
        // 0.5 Check permissions
        if (!this.allowsScraping())
            throw new Error(
                `${new URL('robots.txt', this.baseUrl)} does not allow scraping the specified url ${
                    this.defaultScrapeUrl
                }`
            )

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

            let lastDate = (await entryPoint.getMostRecentListing())?.date ?? new Date(0)

            let totalPageCount: number | undefined

            const handleTotalPageCount = (pages: number) => (totalPageCount = pages)

            options.scrapeType !== 'ALL' &&
                this.log(
                    `Scraping ${
                        maxScrapeCount ? `${maxScrapeCount}` : ''
                    } listings from ${entryPoint.createUrl(
                        1
                    )} created after ${lastDate.toLocaleString()}...`
                )

            let page = 1
            while (shouldContinue) {
                this.log(`Scraping page ${page}/${totalPageCount ?? 'unknown'}...`)
                let { listings, continue: cont } = await this.getBatch({
                    maxScrapeCount,
                    findIndex:
                        options.scrapeType === 'NEW'
                            ? (o) => new Date(o.date).getTime() <= lastDate.getTime()
                            : undefined,
                    entryPoint,
                    page,
                    onTotalPageCount:
                        totalPageCount === undefined ? handleTotalPageCount : undefined,
                })
                page += 1

                batch = listings
                shouldContinue = cont

                if (options.scrapeType === 'ALL') {
                    this.log(`Deleting listings in case duplicates are found`)
                    await this.prisma.listing.deleteMany({
                        where: {
                            origin_id: { in: batch.map((x) => x.origin_id) },
                        },
                    })
                }

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
        }

        this.log('Scraping complete. Deleting old listings...')
        await this.deleteOldListings()
        this.log('DOME')

        this.reset()
    }

    async getMostRecentDate(): Promise<Date | undefined> {
        const listing = await this.prisma.listing.findFirst({
            where: { origin: this.origin },
            orderBy: {
                date: 'desc',
            },
        })

        return listing.date
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

    async watchDelay() {
        const minutesToFillLimit = this.limit / (await this.getListingsAddedAverage())
        let delay = minutesToFillLimit * 0.8 * 60 * 1000 + Math.floor(Math.random() * 10000)

        delay = process.env.NODE_ENV === 'development' ? 20 * 1000 : Math.min(delay, 15 * 60 * 1000)

        return delay
    }

    async createWatchFunction(entryPoint: EntryPoint, index: number) {
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

    entryPoints: BaseEntryPoint<any>[] = []
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

    private uniqueArray: boolean[] = []
    /**
     * Determines the probability of new scraped listings to be unique
     *
     * @returns A number between 0 and 1
     */
    private async probabilityOfUnique(newListings: ScrapedListing[]): Promise<number> {
        if (newListings.length === 0 && this.uniqueArray.length === 0) {
            return 1
        }

        for (const { origin_id } of newListings) {
            this.uniqueArray.push(
                (await this.prisma.listing.findUnique({
                    where: {
                        origin_id,
                    },
                })) == null
            )
        }

        this.uniqueArray = this.uniqueArray.slice(-this.limit)

        const prob =
            this.uniqueArray.reduce((prev, cur) => (cur ? prev + 1 : prev), 0) /
            this.uniqueArray.length

        return prob
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

    /**
     * Get next batch of listings from scrape target
     *
     * @returns Object
     */
    public async getBatch(options: GetBatchOptions): Promise<{
        listings: ScrapedListing[]
        continue: boolean
        reason?: 'MAX_COUNT' | 'MATCH_FOUND'
    }> {
        const { entryPoint, onTotalPageCount } = options
        const client = await this.createAxiosInstance()

        const res = await client.get(entryPoint.createUrl(options.page))

        if (onTotalPageCount) {
            let maxPages = entryPoint.getTotalPages ? entryPoint.getTotalPages(res) : undefined
            onTotalPageCount(maxPages)
        }

        const data = this.extractRawListingsArray(res)
        const listings = data.map(this.parseRawListing)

        return this.createGetBatchReturn(listings, options)
    }

    public async createGetBatchReturn(
        arr: ScrapedListing[],
        options: GetBatchOptions
    ): ReturnType<typeof this.getBatch> {
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
            continue: true,
        }
    }

    reset(): void {
        this.status = ScraperStatus.IDLE
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

    log(message: string) {
        if (process.env.NODE_ENV === 'development' || this.verbose) {
            console.log(`[${this.origin}]: ${message}`)
        }
    }
}
