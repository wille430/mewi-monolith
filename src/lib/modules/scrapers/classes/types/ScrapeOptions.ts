import type { ScrapedListing } from './ScrapedListing'

export type ScrapeOptions = {
    scrapeAmount?: number
    stopAtPredicate?: Parameters<Array<ScrapedListing>['findIndex']>[0]
}
