import { ScraperStatus, stringSimilarity } from '@wille430/common'
import { ListingOrigin, Prisma, Category, ScraperTrigger } from '@mewi/prisma'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import robotsParser from 'robots-parser'
import { IScraper } from './IScraper'
import { PrismaService } from '@/prisma/prisma.service'
import crypto from 'crypto'
import { StartScraperOptions } from '../types/startScraperOptions'
import { Inject } from '@nestjs/common'

export type ScrapedListing = Prisma.ListingCreateInput

export type ListingScraperConstructorArgs = {
    baseUrl: string
    origin: ListingOrigin
    useRobots?: boolean
}

export type GetBatchOptions = {
    maxScrapeCount?: number
    stopWhenIdFound?: string
    scrapeTargetUrl?: string
}

export class ListingScraper implements IScraper<ScrapedListing> {
    status: ScraperStatus = ScraperStatus.IDLE
    client: AxiosInstance
    useRobots: boolean = true

    threshold: number = 0.8
    limit: number = 10

    private readonly defaultStartOptions: StartScraperOptions = {
        triggeredBy: ScraperTrigger.Scheduled,
        scrapeType: 'NEW',
    }

    readonly scrapeTargetUrl: string
    getNextUrl(): string | Promise<string> {
        return this.scrapeTargetUrl
    }

    readonly baseUrl: string
    readonly origin: ListingOrigin
    private readonly deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000

    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService,
        props: ListingScraperConstructorArgs
    ) {
        Object.assign(this, props)

        this.parseRawListing = this.parseRawListing.bind(this)
    }

    async createAxiosInstance(): Promise<AxiosInstance> {
        const instance = axios.create({
            baseURL: this.baseUrl,
        })

        return this.addAuthentication(instance)
    }

    /**
     * Add auth headers to request
     */
    async addAuthentication(axios: AxiosInstance): Promise<AxiosInstance> {
        return axios
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

        if (robots.isAllowed(this.scrapeTargetUrl)) {
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
                    this.scrapeTargetUrl
                }`
            )

        this.status = ScraperStatus.SCRAPING
        let batch: ScrapedListing[] = []
        let isFirstIteration = true
        let scrapedListingCount = 0

        //  1. When...
        // scrapeType === 'NEW': Scrape while there is a high probability of unique listings
        // scrapeType === 'ALL': Scrape until getBatch returns empty
        const shouldContinue = async () => {
            let condition = false
            if (options.scrapeType === 'NEW') {
                condition = (await this.probabilityOfUnique(batch)) > this.threshold
            } else if (options.scrapeType === 'ALL') {
                condition = isFirstIteration ? true : batch.length > 0
            }

            if (options.scrapeCount) {
                condition = condition && scrapedListingCount < options.scrapeCount
            }

            return condition
        }

        while (await shouldContinue()) {
            batch = await this.getBatch()

            // If this is the first time getBatch was called from the start method, limit should be updated
            if (isFirstIteration) {
                this.limit = batch.length
            }
            isFirstIteration = false

            if (options.scrapeType === 'ALL') {
                await this.prisma.listing.deleteMany({
                    where: {
                        origin_id: { in: batch.map((x) => x.origin_id) },
                    },
                })
            }

            // 1.5 Add the scraped listings
            const { count } = await this.prisma.listing.createMany({
                data: batch,
            })
            scrapedListingCount += count

            if (!batch.length) {
                break
            }
        }

        // 2. Delete old
        await this.deleteOldListings()

        // 3. Clean up
        // this.createLog(triggeredBy)

        this.reset()
    }

    private isWatching = false
    watchDelay = () => 60000 + Math.floor(Math.random() * 10000)

    watchEntryPoints() {
        return [this.scrapeTargetUrl]
    }

    // TODO: Scan next page if getBatch returned all listings on page
    async watch() {
        if (this.isWatching) {
            throw new Error(`Class method "watch" is already running.`)
        }
        this.isWatching = true
        const watchEntryPoints = this.watchEntryPoints()
        console.log(`[${this.origin}]: Watching URLs: ${watchEntryPoints.join(', ')}`)

        // Get id of first item
        let firstItemId = await this.getBatch({ maxScrapeCount: 1 }).then((o) => o[0].origin_id)
        console.log(
            `[${this.origin}]: Watching for new listings with ${firstItemId} as starting point...`
        )

        while (this.isWatching) {
            const watchDelay = this.watchDelay()
            for (const watchEntryPoint of watchEntryPoints) {
                const listings = await this.getBatch({
                    stopWhenIdFound: firstItemId,
                    scrapeTargetUrl: watchEntryPoint,
                })
                firstItemId = listings.length > 0 ? listings[0].origin_id : firstItemId

                console.log(
                    `[${this.origin}]: Found ${
                        listings.length
                    } new listings. Watching for new items until origin_id ${firstItemId}. Retrying again in ${
                        watchDelay / 1000
                    } seconds...`
                )

                if (listings.length)
                    await this.prisma.listing.createMany({
                        data: listings,
                    })
            }

            await new Promise<void>((resolve) => {
                setTimeout(resolve, watchDelay)
            })
        }
    }

    async cancelWatch() {
        this.isWatching = false
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

        console.log(`[${this.origin}]: Probability of finding unique listings: ${prob}`)
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
     * @returns Array of scraped listings
     */
    public async getBatch(options: GetBatchOptions = {}): Promise<ScrapedListing[]> {
        this.client = await this.createAxiosInstance()

        const arr: ScrapedListing[] = await this.client
            .get(options.scrapeTargetUrl ?? (await this.getNextUrl()))
            .then(this.extractRawListingsArray)
            .then((data) => data.map(this.parseRawListing))

        if (options.stopWhenIdFound) {
            const index = arr.findIndex((x) => x.origin_id === options.stopWhenIdFound)
            if (index >= 0) {
                console.log(
                    `[${this.origin}]: Found matching origin_id at index ${index}. Returning...`
                )
                return arr.slice(0, index)
            }
        }

        if (options.maxScrapeCount && arr.length < options.maxScrapeCount)
            arr.splice(0, options.maxScrapeCount)

        return arr
    }

    /**
     * Override this function to find the array of unparsed listings
     *
     * @param res Axios Response object
     * @returns An array of objects of unknown shape
     */
    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data
    }

    parseRawListing(obj: Record<string, any>): ScrapedListing {
        return obj as any
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
}
