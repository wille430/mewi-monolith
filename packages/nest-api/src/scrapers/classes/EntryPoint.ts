import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Page } from 'puppeteer'
import puppeteer from 'puppeteer'
import { ListingScraper, ScrapedListing } from '@/scrapers/classes/ListingScraper'
import { PrismaService } from '@/prisma/prisma.service'
import { ListingWebCrawler } from '@/scrapers/classes/ListingWebCrawler'
import { sliceAtIndex } from '@/scrapers/helpers/sliceAtIndex'
import { BaseListingScraper } from '@/scrapers/classes/BaseListingScraper'

export interface CreateConfigFunction {
    (page: number): Promise<AxiosRequestConfig> | AxiosRequestConfig
}

export interface CreateIndexedUrlFunction {
    (page: number, i: number): string
}

export interface GetTotalPagesFunction<T> {
    (res: T extends 'DOM' ? Page : AxiosResponse): number
}

export type ScrapeTargetType = 'DOM' | 'API'

export type ScrapeOptions = {
    maxScrapeCount?: number
    findIndex?: Parameters<Array<ScrapedListing>['findIndex']>[0]
    // onTotalPageCount: (pages: number) => any
}

export type ScrapeResult = {
    listings: ScrapedListing[]
    maxPages?: number
    page: number
    continue: boolean
}

export abstract class BaseEntryPoint {
    /**
     * Scrape web api or web page and return listings with correct shape
     *
     * @param page - The page to scrape from (page \>= 1)
     * @param options - Scrape options
     * @returns Page or AxiosResponse for further
     */
    abstract scrape(
        scraper: BaseListingScraper,
        page: number,
        options: ScrapeOptions
    ): Promise<ScrapeResult>

    constructor(
        readonly prisma: PrismaService,
        readonly createConfig: CreateConfigFunction,
        readonly identifier: string
    ) {}

    public getMostRecentListing() {
        return this.prisma.listing.findFirst({
            where: {
                entryPoint: this.identifier,
            },
            orderBy: {
                date: 'desc',
            },
        })
    }

    createScrapeResult(
        res: any,
        scraper: BaseListingScraper,
        listings: ScrapedListing[],
        pageNumber: number,
        options: ScrapeOptions = {}
    ): ScrapeResult {
        let shouldContinue = true
        const maxPages = scraper.getTotalPages(res)

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

export class EntryPoint extends BaseEntryPoint {
    async scrape(
        scraper: ListingScraper,
        page: number,
        options: ScrapeOptions
    ): Promise<ScrapeResult> {
        const client = await scraper.createAxiosInstance()

        const config = {
            ...scraper.defaultAxiosRequestConfig,
            ...(await this.createConfig(page)),
        }
        const res = await client(config)

        const data = scraper.extractRawListingsArray(res)
        const listings = data.map(scraper.parseRawListing)

        return this.createScrapeResult(page, scraper, listings, page, options)
    }
}
export class EntryPointDOM extends BaseEntryPoint {
    async scrape(
        scraper: ListingWebCrawler,
        pageNumber: number,
        options: ScrapeOptions
    ): Promise<ScrapeResult> {
        // Instantiate puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()
            await page.goto((await this.createConfig(pageNumber)).url)

            const items = await page.$$(scraper.listingSelector)

            const listings = await Promise.all(
                items.map(async (ele) => ({
                    ...(await scraper.evalParseRawListing(ele)),
                    entryPoint: this.identifier,
                }))
            )

            return this.createScrapeResult(page, scraper, listings, pageNumber, options)
        } catch (e) {
            console.error(e)
            return {
                listings: [],
                page: pageNumber,
                continue: false,
            }
        } finally {
            await browser.close()
        }
    }
}
