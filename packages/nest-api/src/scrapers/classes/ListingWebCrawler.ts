import puppeteer, { ElementHandle } from 'puppeteer'
import { GetBatchOptions } from './ListingScraper'
import { BaseListingScraper } from './BaseListingScraper'
import { ScrapedListing } from './ListingScraper'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma } from '@mewi/prisma'
import { EntryPointDOM } from './EntryPoint'
import { StartScraperOptions } from '../types/startScraperOptions'
import axios from 'axios'
import robotsParser from 'robots-parser'

export type ListingWebCrawlerConstructorArgs = {
    listingSelector: string
}

export abstract class ListingWebCrawler extends BaseListingScraper<'DOM'> {
    readonly listingSelector: string
    readonly useRobots: boolean = true
    abstract defaultScrapeUrl: string

    entryPoints: EntryPointDOM[] = []

    constructor(
        readonly prisma: PrismaService,
        { listingSelector }: ListingWebCrawlerConstructorArgs
    ) {
        super()
        this.listingSelector = listingSelector
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

    start(options?: Partial<StartScraperOptions>): Promise<void> {
        // 0.5 Check permissions
        if (!this.allowsScraping())
            throw new Error(
                `${new URL('robots.txt', this.baseUrl)} does not allow scraping the specified url ${
                    this.defaultScrapeUrl
                }`
            )

        return super.start(options)
    }

    public override async getBatch(
        options: GetBatchOptions<'DOM'> & {
            extractListings?: (page: puppeteer.Page) => Promise<any[]>
        }
    ): Promise<{
        listings: Prisma.ListingCreateInput[]
        continue: boolean
        reason?: 'MAX_COUNT' | 'MATCH_FOUND'
    }> {
        const { entryPoint, page: pageNb } = options

        // Instantiate puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()
            await page.goto((await entryPoint.createConfig(pageNb)).url)

            const items = options.extractListings
                ? await options.extractListings(page)
                : await page.$$(this.listingSelector)

            const listings = await Promise.all(
                items.map(async (ele) => ({
                    ...(await this.evalParseRawListing(ele)),
                    entryPoint: options.entryPoint.identifier,
                }))
            )

            return this.createGetBatchReturn(listings, options)
        } catch (e) {
            console.error(e)
            return this.createGetBatchReturn([], options)
        } finally {
            await browser.close()
        }
    }

    abstract evalParseRawListing(ele: ElementHandle<Element>): Promise<ScrapedListing>
}
