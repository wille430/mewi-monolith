import { BaseListingScraper } from './BaseListingScraper'
import { listingStub } from '@/backend/modules/listings/test/stubs/listing.stub'

export const ListingWebCrawler = jest.fn().mockReturnValue({
    ...new BaseListingScraper(),
    evalParseRawListing: jest.fn().mockResolvedValue(listingStub()),
    createEntryPoint: jest.fn(),
    allowsScraping: jest.fn().mockResolvedValue(true),
    defaultStartOptions: {},
})
