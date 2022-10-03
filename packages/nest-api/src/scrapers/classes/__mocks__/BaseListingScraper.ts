import { ScraperConfig } from '@/config/scraper.config'
import { scraperConfigStub } from '@/config/test/stubs/scraper.config.stub'
import { listingStub } from '@/listings/test/stubs/listing.stub'
import { ScraperStatus } from '@wille430/common'

jest.mock('../BaseEntryPoint')

export const BaseListingScraper = jest.fn().mockReturnValue({
    initialize: jest.fn(),
    getConfig: jest.fn().mockImplementation((key: keyof ScraperConfig['default']) => {
        return scraperConfigStub()['default'][key]
    }),
    start: jest.fn(),
    deleteOldListings: jest.fn(),
    createId: jest.fn().mockResolvedValue(listingStub().origin_id),
    log: jest.fn(),
    reset: jest.fn(),
    parseCategory: jest.fn().mockResolvedValue(listingStub().category),
    createEntryPoint: jest.fn(),
    getTotalPages: jest.fn().mockResolvedValue(10),
    status: ScraperStatus.IDLE,
})
