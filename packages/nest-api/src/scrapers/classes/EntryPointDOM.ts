import puppeteer from 'puppeteer'
import { ListingWebCrawler } from '@/scrapers/classes/ListingWebCrawler'
import { BaseEntryPoint } from './BaseEntryPoint'
import { ScrapeOptions } from './types/ScrapeOptions'
import { ScrapeResult } from './types/ScrapeResult'

export class EntryPointDOM extends BaseEntryPoint {
    scraper: ListingWebCrawler

    async scrape(pageNumber: number, options: ScrapeOptions = {}): Promise<ScrapeResult> {
        // Instantiate puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()
            await page.goto((await this.createConfig(pageNumber)).url)

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
