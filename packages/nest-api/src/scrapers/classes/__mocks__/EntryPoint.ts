import { listingStub } from '@/listings/test/stubs/listing.stub'

export const MAX_SCRAPE_DURATION = 1000
export const MIN_SCRAPE_DURATION = 800
const LIMIT = 20

export const EntryPoint = jest.fn().mockReturnValue({
    scrape: jest.fn().mockResolvedValue([listingStub()]),
    createConfig: jest.fn(),
})
