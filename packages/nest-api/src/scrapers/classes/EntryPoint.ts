import { ListingScraper } from '@/scrapers/classes/ListingScraper'
import { BaseEntryPoint } from './BaseEntryPoint'
import { ScrapeResult } from './types/ScrapeResult'
import { ScrapeOptions } from './types/ScrapeOptions'

export class EntryPoint extends BaseEntryPoint {
    scraper: ListingScraper

    async scrape(page: number, options: ScrapeOptions = {}): Promise<ScrapeResult> {
        const client = await this.scraper.createAxiosInstance()

        const config = {
            ...this.scraper.defaultAxiosRequestConfig,
            ...(await this.createConfig(page)),
        }
        const res = await client(config)

        const data = this.scraper.extractRawListingsArray(res)
        const listings = data.map(this.scraper.parseRawListing)

        return this.createScrapeResult(res, listings, page, options)
    }
}
