import type { ScrapedListing } from '../types/ScrapedListing'

export type ScrapeResult = {
    listings: ScrapedListing[]
    maxPages?: number
    page: number
    continue: boolean
}
