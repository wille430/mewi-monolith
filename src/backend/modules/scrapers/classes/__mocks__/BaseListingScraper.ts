import { ScraperStatus } from '@/common/schemas'
import { scraperConfigStub } from '../../test/stubs/scraper-config.stub'
import { listingStub } from '@/backend/modules/listings/test/stubs/listing.stub'

jest.mock('../BaseEntryPoint')

export const BaseListingScraper = jest.fn().mockReturnValue({
    initialize: jest.fn(),
    start: jest.fn(),
    deleteOldListings: jest.fn(),
    createId: jest.fn().mockResolvedValue(listingStub().origin_id),
    log: jest.fn(),
    reset: jest.fn(),
    parseCategory: jest.fn().mockResolvedValue(listingStub().category),
    createEntryPoint: jest.fn(),
    getTotalPages: jest.fn().mockResolvedValue(10),
    status: ScraperStatus.IDLE,
    defaultStartOptions: {
        watchOptions: {
            findFirst: 'date',
        },
    },
    config: scraperConfigStub(),
})
