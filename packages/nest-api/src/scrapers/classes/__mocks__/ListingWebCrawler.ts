import { listingStub } from '@/listings/test/stubs/listing.stub'
import { BaseListingScraper } from './BaseListingScraper'

export const ListingWebCrawler = jest.fn().mockReturnValue({
    ...new BaseListingScraper(),
    evalParseRawListing: jest.fn().mockResolvedValue(listingStub()),
    createEntryPoint: jest.fn(),
    allowsScraping: jest.fn().mockResolvedValue(true),
    defaultStartOptions: {},
})
