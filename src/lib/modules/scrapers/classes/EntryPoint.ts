import { BaseEntryPoint } from './BaseEntryPoint'
import type { ScrapeResult } from './types/ScrapeResult'
import type { ScrapeOptions } from './types/ScrapeOptions'
import type { ListingScraper } from './ListingScraper'

export class EntryPoint extends BaseEntryPoint {
    scraper!: ListingScraper

    async scrape(page: number, options: ScrapeOptions = {}): Promise<ScrapeResult> {
        const client = await this.scraper.createAxiosInstance()

        const config = {
            ...this.scraper.defaultAxiosRequestConfig,
            ...(await this.createConfig(page)),
        }

        const res = await client(config)

        const data: any[] = this.scraper.extractRawListingsArray(res)
        const listings = await Promise.all(
            data.map((o) => this.scraper.parseRawListing(o, this.createContext()))
        )

        return this.createScrapeResult(res, listings, page, options)
    }
}
