import type { ScrapedListing } from './ScrapedListing'

export type ScrapeResult = {
    listings: ScrapedListing[]
    maxPages?: number
    page: number
    continue: boolean
}
