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
        res: AxiosResponse | Page,
        listings: ScrapedListing[],
        pageNumber: number,
        options: ScrapeOptions = {}
    ): ScrapeResult {
        let shouldContinue = true
        const maxPages = this.scraper.getTotalPages(res)

        if (options.maxScrapeCount && options.maxScrapeCount < listings.length) {
            listings = listings.splice(0, options.maxScrapeCount)
            shouldContinue = false
        }

        // Remove based on findIndex function
        if (options.findIndex) {
            const temp = sliceAtIndex(listings, options.findIndex)

            if (temp.length < listings.length) {
                shouldContinue = false
                listings = temp
            }
        }

        return {
            listings: listings,
            continue: shouldContinue,
            maxPages: maxPages,
            page: pageNumber,
        }
    }
}
