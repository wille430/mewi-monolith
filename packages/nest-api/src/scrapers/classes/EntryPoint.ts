import { ListingScraper } from '@/scrapers/classes/ListingScraper'
import { BaseEntryPoint } from './BaseEntryPoint'
import { ScrapeResult } from './types/ScrapeResult'
import { ScrapeOptions } from './types/ScrapeOptions'
import { AxiosResponse } from 'axios'

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
            console.error((e as any).response?.data ?? e)
            return {
                continue: false,
                listings: [],
                page: -1,
            }
        }

        const data: any[] = this.scraper.extractRawListingsArray(res)
        const listings = data.map((o) => this.scraper.parseRawListing(o, this.createContext()))

        return this.createScrapeResult(res, listings, page, options)
    }
}
