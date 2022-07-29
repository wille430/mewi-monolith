import { ElementHandle } from 'puppeteer'
import axios from 'axios'
import robotsParser from 'robots-parser'
import { BaseListingScraper } from './BaseListingScraper'
import { ScrapedListing } from './ListingScraper'
import { EntryPointDOM } from './EntryPoint'
import { StartScraperOptions } from '../types/startScraperOptions'
import { PrismaService } from '@/prisma/prisma.service'

export type ListingWebCrawlerConstructorArgs = {
    listingSelector: string
}

export abstract class ListingWebCrawler extends BaseListingScraper {
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

    abstract evalParseRawListing(ele: ElementHandle<Element>): Promise<ScrapedListing>
}
