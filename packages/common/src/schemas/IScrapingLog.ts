import { ListingOrigin } from './enums/listing-origin.enum'
import { ScraperTrigger } from './enums/scraper-trigger.enum'

export interface IScrapingLog {
    id: string
    addedCount: number
    errorCount: number

    // Properties used to identify when to stop scraping next time
    entryPoint: string
    scrapeToId?: string
    scrapeToDate?: Date

    target: ListingOrigin
    triggeredBy: ScraperTrigger
}
