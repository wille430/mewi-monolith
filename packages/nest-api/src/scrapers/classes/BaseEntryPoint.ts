import { AxiosResponse } from 'axios'
import { Page } from 'puppeteer'
import { ScrapedListing } from './types/ScrapedListing'
import { PrismaService } from '@/prisma/prisma.service'
import { sliceAtIndex } from '@/scrapers/helpers/sliceAtIndex'
import { BaseListingScraper } from '@/scrapers/classes/BaseListingScraper'
import { CreateConfigFunction } from './types/CreateConfigFunction'
import { ScrapeOptions } from './types/ScrapeOptions'
import { ScrapeResult } from './types/ScrapeResult'
import { ScrapeContext } from './types/ScrapeContext'

export abstract class BaseEntryPoint {
    /**
     * Scrape web api or web page and return listings with correct shape
     *
     * @param page - The page to scrape from (page \>= 1)
     * @param options - Scrape options
     * @returns Page or AxiosResponse for further
     */
    abstract scrape(page: number, options: ScrapeOptions): Promise<ScrapeResult>

    constructor(
        readonly prisma: PrismaService,
        readonly scraper: BaseListingScraper,
        readonly createConfig: CreateConfigFunction,
        readonly identifier: string
    ) {}

    public getMostRecentLog() {
        return this.prisma.scrapingLog.findFirst({
            where: {
                entryPoint: this.identifier,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    createContext(): ScrapeContext {
        return {
            entryPoint: this,
            scraper: this.scraper,
        }
    }

    createScrapeResult(
        res: AxiosResponse | Page | undefined,
        listings: ScrapedListing[],
        pageNumber: number,
        options: ScrapeOptions = {}
    ): ScrapeResult {
        const maxPages = res && this.scraper.getTotalPages(res)
        const [retListings, shouldContinue] = this.sliceListings(listings, options)

        return {
            listings: retListings,
            continue: shouldContinue,
            maxPages: maxPages,
            page: pageNumber,
        }
    }

    /**
     * Removes listings after a certain index depending on input options.
     * If any listings were removed, false will be returned in the array,
     * otherwise true.
     *
     * This functions is used when determining of a entrypoint should continue
     * to scrape.
     *
     * @param listings - An array of scraped listings
     * @param options - A ScrapeOptions object
     * @returns - [sliced listings, shouldContinue]
     */
    private sliceListings(
        listings: ScrapedListing[],
        options: ScrapeOptions
    ): [ScrapedListing[], boolean] {
        let retListings = listings

        if (options.maxScrapeCount && options.maxScrapeCount < listings.length) {
            retListings = retListings.splice(0, options.maxScrapeCount)
        }

        if (options.findIndex) {
            retListings = sliceAtIndex(retListings, options.findIndex)
        }

        const shouldContinue = retListings.length < listings.length && listings.length > 0
        return [retListings, shouldContinue]
    }
}
