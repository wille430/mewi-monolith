import { ScrapeResult } from '../../classes/types/ScrapeResult'
import { listingStub } from '@/lib/modules/listings/test/stubs/listing.stub'

export const scrapeResultStub = (): ScrapeResult => ({
    continue: true,
    page: 1,
    maxPages: 1,
    listings: [listingStub()],
})
