import { ScrapedListing } from './ScrapedListing'

export type ScrapeOptions = {
    maxScrapeCount?: number
    findIndex?: Parameters<Array<ScrapedListing>['findIndex']>[0]
}
