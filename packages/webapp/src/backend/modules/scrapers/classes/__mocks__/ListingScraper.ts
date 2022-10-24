import { BaseListingScraper } from './BaseListingScraper'
import { listingStub } from '@/listings/test/stubs/listing.stub'

export const ListingScraper = jest.fn().mockReturnValue({
    ...new BaseListingScraper(),
    extractRawListingsArray: jest.fn().mockResolvedValue([listingStub()]),
    parseRawListing: jest.fn().mockResolvedValue(listingStub()),
    createEntryPoint: jest.fn(),
})
