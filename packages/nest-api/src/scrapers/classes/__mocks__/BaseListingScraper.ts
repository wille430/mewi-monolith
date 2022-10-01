import { ScraperConfig } from '@/config/scraper.config'
import { listingStub } from '@/listings/test/stubs/listing.strub'

export const BaseListingScraper = jest.fn().mockReturnValue({
    initialize: jest.fn(),
    getConfig: jest.fn().mockResolvedValue({
        default: {
            deleteOlderThan: 99999,
            limit: 10,
        },
    } as ScraperConfig),
    start: jest.fn(),
    deleteOldListings: jest.fn(),
    createId: jest.fn().mockResolvedValue(listingStub().origin_id),
    log: jest.fn(),
    reset: jest.fn(),
    parseCategory: jest.fn().mockResolvedValue(listingStub().category),
    createEntryPoint: jest.fn(),
    getTotalPages: jest.fn().mockResolvedValue(10),
})
