import { ScraperStatus, stringSimilarity } from '@wille430/common'
import { ListingOrigin, Prisma, Category } from '@mewi/prisma'
import axios, { AxiosInstance } from 'axios'
import robotsParser from 'robots-parser'
import { IScraper } from './IScraper'
import { PrismaService } from '@/prisma/prisma.service'
import crypto from 'crypto'

export type ScrapedListing = Prisma.ListingCreateInput

export type ListingScraperConstructorArgs = {
    baseUrl: string
    origin: ListingOrigin
    useRobots?: boolean
}

export class ListingScraper implements IScraper<ScrapedListing> {
    status: ScraperStatus = ScraperStatus.IDLE
    client: AxiosInstance
    useRobots: boolean = true

    threshold: number = 0.8
    limit: number = 10

    readonly scrapeTargetUrl: string
    readonly baseUrl: string
    readonly origin: ListingOrigin
    private readonly deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000

    constructor(private readonly prisma: PrismaService, props: ListingScraperConstructorArgs) {
        Object.assign(this, props)
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

    async start() {
        // 0.5 Check permissions
        if (!this.allowsScraping())
            throw new Error(
                `${new URL('robots.txt', this.baseUrl)} does not allow scraping the specified url ${
                    this.scrapeTargetUrl
                }`
            )

        this.status = ScraperStatus.SCRAPING
        const scrapedListings: ScrapedListing[] = []

        //  1. Scrape while there is a high probability of unique listings
        while (
            (await this.probabilityOfUnique(
                scrapedListings.slice(scrapedListings.length - this.limit)
            )) > this.threshold
        ) {
            const batch = await this.getBatch()

            // If this is the first time getBatch was called from the start method, limit should be updated
            if (scrapedListings.length <= 0) {
                this.limit = batch.length
            }

            scrapedListings.push(...batch)

            if (!batch.length) {
                break
            }
        }

        // 1.5 Add the scraped listings
        await this.prisma.listing.createMany({
            data: scrapedListings,
        })

        // 2. Delete old
        await this.deleteOldListings()

        // 3. Clean up
        // this.createLog(triggeredBy)

        this.reset()
    }

    private uniqueArray: boolean[] = []
    /**
     * Determines the probability of new scraped listings to be unique
     *
     * @returns A number between 0 and 1
     */
    private async probabilityOfUnique(newListings: ScrapedListing[]): Promise<number> {
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
     * @returns Array of scraped listings
     */
    public async getBatch(): Promise<ScrapedListing[]> {
        this.client = await this.createAxiosInstance()

        const arr = await this.client
            .get(this.scrapeTargetUrl)
            .then((res) => res.data.map(this.parseRawListing))

        return arr
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
