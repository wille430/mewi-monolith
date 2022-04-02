import { Listing, ListingDocument } from '@/listings/listing.schema'
import axios from 'axios'
import { scheduleJob } from 'node-schedule'
import robotsParser from 'robots-parser'
import { Model } from 'mongoose'
import { ListingOrigins } from '@mewi/common/types'
import { validate } from 'class-validator'

export interface ScraperOptions {
    limit?: number
    useRobots?: boolean
    deleteOlderThan?: number
}

export class Scraper {
    /**
     * @param maxEntries - How many listings with the same origin that should be present at once in the database
     */
    maxEntries = 10
    /**
     * @param listingScraped - The number of listings that currently have been scraped in the current instance
     */
    listingScraped = 0
    /**
     * @param name - The name of the \{Scraper\}, preferably the name of the domain that is scraped
     */
    name: ListingOrigins
    /**
     * @param limit - Number of listings that are fetched each iteration, default 10
     */
    limit = 10
    /**
     * @param endDate - When the scraper encounters a listing with a date before this, the scraper will stop.
     * The reason for this is to avoid duplications in the database
     */
    endDate: number
    /**
     * @param baseUrl - e.g. https://www.blocket.se/
     */
    baseUrl: string
    /**
     * @param useRobots - Whether or not to check robots.txt. False by default.
     */
    useRobots = false
    /**
     * @param cronTimerSchedule - When to schedule this scraper in cron time
     */
    cronTimerSchedule = '30 * * * *'
    /**
     * @param canCrawl - If false, then the scraper wont start. Ignored if \@param useRobots is false.
     */
    canCrawl = false
    /**
     * @param deleteOlderThan - Date in unix time
     */
    deleteOlderThan = Date.now() - 2 * 24 * 60 * 60 * 1000

    constructor(
        private listingModel: Model<ListingDocument>,
        name: ListingOrigins,
        baseUrl: string,
        { limit, useRobots }: ScraperOptions
    ) {
        this.name = name
        this.baseUrl = baseUrl

        this.limit = limit ?? this.limit
        this.useRobots = useRobots ?? this.useRobots
    }

    async checkRobots() {
        // skip if useRobots is false
        if (!this.useRobots) {
            this.canCrawl = true
            return
        }

        const robotsTxt = await axios.get(this.baseUrl).then((res) => res.data)

        const robots = robotsParser(this.baseUrl + 'robots.txt', robotsTxt)

        if (robots.isAllowed(this.baseUrl)) {
            this.canCrawl = true
        } else {
            this.canCrawl = false
        }
    }

    /**
     * Scrape next listings
     * @returns \{Array\<Listing[]\>\}
     */
    async getListings(): Promise<Listing[]> {
        return []
    }

    /**
     * Initializing scraping
     */
    async start() {
        let scrapedListings = await this.getListings()
        let remainingEntries =
            this.maxEntries - (await this.listingModel.count({ origin: ListingOrigins[this.name] }))
        const errors: Record<string, string> = {}

        console.log(`Remaining listings to add: ${remainingEntries}`)

        let i = 0
        while (scrapedListings.length && remainingEntries > 0) {
            const validListings = await this.getValidListings(scrapedListings)
            const listingCountToAdd = Math.min(remainingEntries, validListings.length)

            validListings.slice(0, listingCountToAdd)

            await this.listingModel.insertMany(validListings).catch((e) => {
                errors[i] = e
            })

            scrapedListings = await this.getListings()
            remainingEntries -= validListings.length
            this.listingScraped += validListings.length
            i += 1
        }

        console.log(`Following errors occurred when scraping ${this.name}:`, errors)
        console.log(`Scraping ended with a total of ${this.listingScraped} listings scraped`)
    }

    schedule(callback?: () => void) {
        console.log(
            `Scheduling ${this.name}-scraper with cron time schedule (${this.cronTimerSchedule})`
        )
        scheduleJob(this.cronTimerSchedule, () => {
            this.start().then(async () => {
                await this.deleteOld()
                callback && callback()
            })
        })
    }

    async deleteOld(): Promise<void> {
        const { deletedCount } = await this.listingModel.deleteMany({
            date: { $lte: this.deleteOlderThan },
        })

        console.log(`Successfully deleted ${deletedCount} items with origin ${this.name}`)
    }

    private async getValidListings(listings: Listing[]) {
        const validListings: Listing[] = []

        for (const listing of listings) {
            const errors = await validate(Listing.name, listing)

            if (!errors.length) {
                validListings.push(listing)
            }
        }

        return validListings
    }
}
