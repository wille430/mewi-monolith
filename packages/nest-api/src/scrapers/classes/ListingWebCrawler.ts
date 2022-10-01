import { ElementHandle } from 'puppeteer'
import axios from 'axios'
import robotsParser from 'robots-parser'
import { BaseListingScraper } from './BaseListingScraper'
import { ScrapedListing } from './types/ScrapedListing'
import { CreateConfigFunction } from './types/CreateConfigFunction'
import { EntryPointDOM } from './EntryPointDOM'
import { StartScraperOptions } from '../types/startScraperOptions'
import { ScrapeContext } from './types/ScrapeContext'
import { ConfigService } from '@nestjs/config'
import { ListingsRepository } from '@/listings/listings.repository'

export type ListingWebCrawlerConstructorArgs = {
    listingSelector: string
}

export abstract class ListingWebCrawler extends BaseListingScraper {
    readonly listingSelector: string
    readonly useRobots: boolean = true
    abstract defaultScrapeUrl: string

    entryPoints: EntryPointDOM[] = []

    constructor(
        readonly listingsRepository: ListingsRepository,
        readonly config: ConfigService,
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
        if (!this.allowsScraping())
            throw new Error(
                `${new URL('robots.txt', this.baseUrl)} does not allow scraping the specified url ${
                    this.defaultScrapeUrl
                }`
            )

        return super.start(options)
    }

    abstract evalParseRawListing(
        ele: ElementHandle<Element>,
        context: ScrapeContext
    ): Promise<ScrapedListing>

    createEntryPoint(createConfig: CreateConfigFunction, identifier?: string) {
        if (!this.entryPoints) this.entryPoints = []

        this.entryPoints.push(
            new EntryPointDOM(
                this.listingsRepository,
                this,
                createConfig,
                identifier ?? this.origin
            )
        )
    }
}
