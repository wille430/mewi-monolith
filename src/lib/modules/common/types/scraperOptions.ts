import { ScrapePredicate } from '../../scrapers/classes/types/ScrapePredicate'

export interface ScraperOptions {
    useRobots: boolean
    deleteOlderThan: number
    limit: number
    interval: number
    listingCount: number
    minListings: number
    scrapeStopAt: ScrapePredicate
    onNextEntryPoint?: () => any
}
