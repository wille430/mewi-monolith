import { listingStub } from '@/listings/test/stubs/listing.stub'
import type { ScrapeResult } from '@/scrapers/classes/types/ScrapeResult'

export const scrapeResultStub = (): ScrapeResult => ({
    continue: true,
    page: 1,
    maxPages: 1,
    listings: [listingStub()],
})
