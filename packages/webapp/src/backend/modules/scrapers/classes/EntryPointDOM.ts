import * as puppeteer from 'puppeteer'
import { BaseEntryPoint } from './BaseEntryPoint'
import type { ListingWebCrawler } from './ListingWebCrawler'
import type { ScrapeOptions } from './types/ScrapeOptions'
import type { ScrapeResult } from './types/ScrapeResult'

export class EntryPointDOM extends BaseEntryPoint {
    scraper!: ListingWebCrawler

    async scrape(pageNumber: number, options: ScrapeOptions = {}): Promise<ScrapeResult> {
        // Instantiate puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()
            const config = await this.createConfig(pageNumber)

            if (!config.url) throw new Error('config createConfig contains no property named url')

            await page.goto(config.url)

            const items = await page.$$(this.scraper.listingSelector)

            const listings = await Promise.all(
                items.map(
                    async (ele) => await this.scraper.evalParseRawListing(ele, this.createContext())
                )
            )

            return this.createScrapeResult(page, listings, pageNumber, options)
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
