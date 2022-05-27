import axios from 'axios'
import robotsParser from 'robots-parser'
import { ConfigService } from '@nestjs/config'
import { ListingOrigin, Prisma, ScraperTrigger } from '@mewi/prisma'
import { StartScraperOptions } from './types/startScraperOptions'
import { PrismaService } from '@/prisma/prisma.service'

export interface ScraperOptions {
    useRobots?: boolean
    deleteOlderThan?: number
    limit?: number
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
    name: ListingOrigin
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
    scrapeUrl: string
    /**
     * @param useRobots - Whether or not to check robots.txt. False by default.
     */
    useRobots = false
    /**
     * @param canCrawl - If false, then the scraper wont start. Ignored if \@param useRobots is false.
     */
    canCrawl = false
    /**
     * @param deleteOlderThan - Date in unix time
     */
    deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000
    /**
     * @param started - Whether or not the scraper is running
     */
    isScraping = false

    private quantityToScrape: number | null
    private listingCount: number | null

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        name: ListingOrigin,
        baseUrl: string,
        { useRobots }: ScraperOptions
    ) {
        this.name = name
        this.scrapeUrl = baseUrl

        this.maxEntries =
            this.configService.get<number>(`scraper.${this.name}.limit`) ??
            this.configService.get<number>('scraper.default.limit') ??
            0

        this.useRobots = useRobots ?? this.useRobots
    }

    async checkRobots() {
        // skip if useRobots is false
        if (!this.useRobots) {
            this.canCrawl = true
            return
        }

        const robotsTxt = await axios.get(this.scrapeUrl).then((res) => res.data)

        const robots = robotsParser(this.scrapeUrl + 'robots.txt', robotsTxt)

        if (robots.isAllowed(this.scrapeUrl)) {
            this.canCrawl = true
        } else {
            this.canCrawl = false
        }
    }

    /**
     * Scrape next listings
     * @returns \{Array\<Listing[]\>\}
     */
    async getListings(): Promise<Prisma.ListingCreateInput[]> {
        return []
    }

    /**
     * Initializing scraping
     */
    async start({ triggeredBy }: StartScraperOptions = { triggeredBy: ScraperTrigger.Scheduled }) {
        this.isScraping = true
        this.listingScraped = 0

        let scrapedListings = await this.getListings()
        let remainingEntries = await this.getQuantityToScrape
        const errors: Record<string, string> = {}

        let i = 0
        while (scrapedListings.length && remainingEntries > 0) {
            const listingCountToAdd = Math.min(remainingEntries, scrapedListings.length)

            scrapedListings = scrapedListings.slice(0, listingCountToAdd)

            // Insert to database
            for (const listing of scrapedListings) {
                await this.prisma.listing
                    .create({
                        data: listing,
                    })
                    .catch((e) => {
                        console.log(e.message)
                        errors[i] = e
                    })
            }

            scrapedListings = await this.getListings()
            remainingEntries -= scrapedListings.length
            this.listingScraped += scrapedListings.length
            i += 1
        }

        // Create scrape logs
        await this.prisma.scrapingLog.create({
            data: {
                added_count: this.listingScraped,
                error_count: Object.keys(errors).length,
                target: this.name,
                total_count: await this.prisma.listing.count({ where: { origin: this.name } }),
                triggered_by: triggeredBy,
            },
        })

        this.isScraping = false
        this.quantityToScrape = null
        this.listingCount += this.listingScraped
    }

    async deleteOld(): Promise<void> {
        await this.prisma.listing.deleteMany({
            where: {
                date: {
                    lte: new Date(this.deleteOlderThan),
                },
            },
        })
    }

    /**
     * Get number of listings to scrape
     * @returns Number of listings to scrape
     */
    get getQuantityToScrape(): Promise<number> {
        if (this.quantityToScrape) {
            return new Promise((resolve) => resolve(this.quantityToScrape))
        }

        return new Promise((resolve) => {
            this.getListingCount.then((count) => {
                this.quantityToScrape = Math.max(0, this.maxEntries - count)
                resolve(this.quantityToScrape)
            })
        })
    }

    /**
     *
     */
    get getListingCount(): Promise<number> {
        if (this.listingCount) {
            return new Promise((resolve) => resolve(this.listingCount))
        }

        return this.prisma.listing.count({ where: { origin: this.name } })
    }
}
