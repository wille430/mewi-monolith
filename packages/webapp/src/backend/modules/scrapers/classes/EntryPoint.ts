import type { AxiosResponse } from 'axios'
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

        let res: AxiosResponse
        try {
            res = await client(config)
        } catch (e) {
            this.scraper.log('ERROR: ' + (e as any).response?.data ?? e)
            return {
                continue: false,
                listings: [],
                page: page,
            }
        }

        const data: any[] = this.scraper.extractRawListingsArray(res)
        const listings = await Promise.all(
            data.map((o) => this.scraper.parseRawListing(o, this.createContext()))
        )

        return this.createScrapeResult(res, listings, page, options)
    }
}
