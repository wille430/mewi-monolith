import axios from 'axios'
import robotsParser from 'robots-parser'
import { ConfigService } from '@nestjs/config'
import { ListingOrigin, Prisma, ScraperTrigger, Category, Currency } from '@mewi/prisma'
import { stringSimilarity } from '@wille430/common'
import puppeteer, { ElementHandle } from 'puppeteer'
import crypto from 'crypto'
import { StartScraperOptions } from './types/startScraperOptions'
import { ScraperType } from './scraper-type.enum'
import { PrismaService } from '@/prisma/prisma.service'

export interface ScraperOptions {
    useRobots?: boolean
    deleteOlderThan?: number
    limit?: number
    scraperType?: ScraperType
}

export type ScraperEvalArgs = {
    Category: typeof Category
    selector: string
    scrapeUrl: string
    Currency: typeof Currency
    ListingOrigin: typeof ListingOrigin
    date: Date
    [key: string]: any
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

    private _quantityToScrape: number | null
    private listingCount: number | null
    private stringToCategoryMap = {}

    scraperType: ScraperType

    // Webscraper specific properties
    webscraper = {
        listingSelector: '.item',
    }

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        name: ListingOrigin,
        baseUrl: string,
        { useRobots, scraperType }: ScraperOptions
    ) {
        this.name = name
        this.scrapeUrl = baseUrl

        this.maxEntries =
            this.configService.get<number>(`scraper.${this.name}.limit`) ??
            this.configService.get<number>('scraper.default.limit') ??
            0

        this.useRobots = useRobots ?? this.useRobots
        this.scraperType = scraperType ?? ScraperType.API_FETCH
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
        let remainingEntries = await this.quantityToScrape
        const errors: Record<string, string> = {}

        let i = 0
        while (scrapedListings.length && remainingEntries > 0) {
            const listingCountToAdd = Math.min(remainingEntries, scrapedListings.length)

            scrapedListings = scrapedListings.slice(0, listingCountToAdd)

            // Insert to database
            for (const listing of scrapedListings) {
                // check for duplicate
                const exists = await this.prisma.listing
                    .count({ where: { origin_id: listing.origin_id } })
                    .then((o) => o > 0)
                if (exists) continue

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
        this._quantityToScrape = null
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
    get quantityToScrape(): Promise<number> {
        if (this._quantityToScrape) {
            return new Promise((resolve) => resolve(this._quantityToScrape))
        }

        return new Promise((resolve) => {
            this.getListingCount.then((count) => {
                this._quantityToScrape = Math.max(0, this.maxEntries - count)
                resolve(this._quantityToScrape)
            })
        })
    }

    set quantityToScrape(count: number | Promise<number>) {
        if (typeof count === 'number') {
            this._quantityToScrape = count
        } else {
            // is promise
            count.then((c) => {
                this._quantityToScrape = c
            })
        }
    }

    get getListingCount(): Promise<number> {
        if (this.listingCount) {
            return new Promise((resolve) => resolve(this.listingCount))
        }

        return this.prisma.listing.count({ where: { origin: this.name } })
    }

    reset() {
        this.listingScraped = 0
        this.isScraping = false
    }

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

    createId(string: string) {
        const shasum = crypto.createHash('sha1')
        shasum.update(string)

        return `${this.name}-${shasum.digest('hex')}`
    }

    /**
     * Create a valid listing object from element handle
     *
     * @param ele - Puppeteer element handle
     * @param args - An object containing required arguments
     * @returns A listing object
     */
    evalParseRawListing(
        ele: ElementHandle<Element>,
        args: ScraperEvalArgs
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ): Prisma.ListingCreateInput | Promise<Prisma.ListingCreateInput> {
        return {} as unknown as any
    }

    /**
     * Convert object from external API to valid listing object
     *
     * @param obj - Object containing data which should be parsed
     * @returns A listing object
     */
    parseRawListing(
        obj: Record<string, any>
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ): Prisma.ListingCreateInput {
        return {} as unknown as any
    }

    async evaluate(
        scrapeUrl: string = this.scrapeUrl,
        parseFunction: (
            ele: ElementHandle<Element>,
            args: ScraperEvalArgs
        ) => Prisma.ListingCreateInput | Promise<Prisma.ListingCreateInput>,
        args: Record<any, any> = {}
    ): Promise<Prisma.ListingCreateInput[]> {
        if (this.scraperType !== ScraperType.WEBSCRAPER) {
            throw new Error(
                `Evaluate can only be called on scrapers with scraperType ${ScraperType.WEBSCRAPER}. Change the property to ${ScraperType.WEBSCRAPER} and try again.`
            )
        }

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })
        const _args: ScraperEvalArgs = {
            Category: Category,
            selector: this.webscraper.listingSelector,
            Currency: Currency,
            ListingOrigin: ListingOrigin,
            date: new Date(),
            scrapeUrl: this.scrapeUrl,
            ...args,
        }

        try {
            const page = await browser.newPage()
            await page.goto(scrapeUrl)

            // Expose required functions
            await page.exposeFunction('log', console.log)

            // 'this' is not available in eval context
            const name = this.name
            const createId = (string: string) => {
                const shasum = crypto.createHash('sha1')
                shasum.update(string)

                return `${name}-${shasum.digest('hex')}`
            }
            await page.exposeFunction('createId', createId)

            const items = await page.$$(this.webscraper.listingSelector)
            const listings = await Promise.all(items.map((ele) => parseFunction(ele, _args)))

            await browser.close()

            return listings
        } catch (e) {
            console.log(e)
            await browser.close()
            return []
        }
    }
}
