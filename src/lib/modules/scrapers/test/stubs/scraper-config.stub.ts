import { ScraperOptions } from '@/lib/modules/common/types/scraperOptions'

export const scraperConfigStub = (): ScraperOptions => ({
    deleteOlderThan: new Date().getTime(),
    limit: 10,
    interval: 60 * 1000,
    listingCount: 200,
    minListings: 10,
    useRobots: false,
    scrapeStopAt: 'date',
})
