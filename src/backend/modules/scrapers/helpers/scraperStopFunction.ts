import { safeToDate } from '@/common/schemas'
import type { ScrapePredicate } from '../classes/types/ScrapePredicate'
import type { ScrapeCompareValue } from '../classes/types/ScrapeCompareValue'
import type { ScrapedListing } from '../classes/types/ScrapedListing'

/**
 * Creates a predicate function used for determining whether
 * it should stop scraping. If stopAt is undefined the return
 * function will in practice never return true.
 *
 * @param field - The key of the value to compare
 * @param stopAt - The value to look for when deciding whether or not to stop
 * @returns - A function used as argument for Array.prototype.find
 */
export const scraperStopFunction = <T extends ScrapePredicate>(
    field: T,
    stopAt: ScrapeCompareValue[T] | undefined
): Parameters<Array<ScrapedListing>['find']>[0] => {
    switch (field) {
        case 'date':
            return (listing, index, listings) => {
                const stopAtDate = safeToDate(listing.date)?.getTime() ?? 0
                const shouldStop = stopAtDate <= (safeToDate(stopAt)?.getTime() ?? 0)

                return shouldStop
            }
        case 'origin_id':
        default:
            return (listing, index, listings) => {
                if (stopAt == null) {
                    return false
                }

                return listing.origin_id === stopAt
            }
    }
}

export type ScraperStopFunction = typeof scraperStopFunction
