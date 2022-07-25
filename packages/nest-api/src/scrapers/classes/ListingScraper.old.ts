import { ScraperTrigger, ListingOrigin, Prisma } from '@mewi/prisma'
import { ScraperStatus } from '@wille430/common'
import axios from 'axios'
import crypto from 'crypto'
import { PrismaService } from '@/prisma/prisma.service'

export type ScraperOptions = {
    useRobots?: boolean
    scrapeTargetUrl: string
    baseUrl: string
}

export type ScrapedListing = Prisma.ListingCreateInput

export class ListingScraper {
    limit = 10
    readonly scrapeTargetUrl: string
    readonly baseUrl: string
    readonly origin: ListingOrigin

    private readonly threshold = 0.8
    private readonly deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000

    private readonly scrapedListings: ScrapedListing[] = []

    public status: ScraperStatus = ScraperStatus.IDLE

    constructor(
        private readonly prisma: PrismaService,
        origin: ListingOrigin,
        options: ScraperOptions
    ) {
        this.origin = origin

        Object.assign(this, options)
    }

    /**
     * Begin scraping
     *
     * @param triggeredBy - How the start method was invoked. Scheduled by default.
     */
    public async start(triggeredBy = ScraperTrigger.Scheduled): Promise<void> {
        this.status = ScraperStatus.SCRAPING

        // 0.5 Check permissions
        if (!this.checkPermissions()) {
            console.warn(`[${this.origin}]: Cannot scrape target. Permission denied.`)
            return
        }

        //  1. Scrape while there is a high probability of unique listings
        while ((await this.probabilityOfUnique()) > this.threshold) {
            const batch = await this.getBatch()

            // If this is the first time getBatch was called from the start method, limit should be updated
            if (this.scrapedListings.length <= 0) {
                this.limit = batch.length
            }

            this.scrapedListings.push(...batch)

            if (!batch.length) {
                break
            }
        }

        // 1.5 Add the scraped listings
        await this.prisma.listing.createMany({
            data: this.scrapedListings,
        })

        // 2. Delete old
        await this.deleteOldListings()

        // 3. Clean up
        this.createLog(triggeredBy)
        this.status = ScraperStatus.IDLE

        // Clear array
        this.scrapedListings.splice(0, this.scrapedListings.length)
    }

    /**
     * Get next batch of listings from scrape target
     *
     * @returns Array of scraped listings
     */
    public async getBatch(): Promise<ScrapedListing[]> {
        const arr = await axios
            .get(this.scrapeTargetUrl)
            .then((res) => res.data.map(this.parseRawListing))

        return arr
    }

    parseRawListing(obj: Record<string, any>): ScrapedListing {
        return obj as any
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

    private lastLength = 0
    private uniqueArray: boolean[] = []

    /**
     * Determines the probability of new scraped listings to be unique
     *
     * @returns A number between 0 and 1
     */
    private async probabilityOfUnique(): Promise<number> {
        const newListings = this.scrapedListings.slice(this.lastLength)

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

        this.lastLength = this.scrapedListings.length
        return prob
    }

    private async createLog(triggeredBy = ScraperTrigger.Scheduled) {
        await this.prisma.scrapingLog.create({
            data: {
                added_count: this.scrapedListings.length,
                error_count: 0,
                target: this.origin,
                total_count: await this.prisma.listing.count({ where: { origin: this.origin } }),
                triggered_by: triggeredBy,
            },
        })
    }

    /**
     * Checks whether or not the website allows scraping
     *
     * @returns True if the website allows scraping
     */
    checkPermissions(): Promise<boolean> {
        return Promise.resolve(true)
    }

    reset() {
        this.scrapedListings.splice(0, this.scrapedListings.length)
        this.status = ScraperStatus.IDLE
    }
}
