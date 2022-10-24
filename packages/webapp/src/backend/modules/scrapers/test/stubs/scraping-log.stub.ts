import faker from '@faker-js/faker'
import { ScraperTrigger } from '@wille430/common'
import type { WithId } from 'mongodb'
import mongoose from 'mongoose'
import type { ScrapingLog } from '@/schemas/scraping-log.schema'
import { listingStub } from '@/listings/test/stubs/listing.stub'
import { timestampsStub } from '@/common/test/stubs/timestamps.stub'

const id = faker.database.mongodbObjectId()
export const scrapingLogStub = (): WithId<ScrapingLog> => ({
    _id: new mongoose.Types.ObjectId(id),
    id: id,
    addedCount: 1,
    entryPoint: listingStub().entryPoint,
    errorCount: 0,
    scrapeToDate: listingStub().date,
    scrapeToId: listingStub().origin_id,
    target: listingStub().origin,
    triggeredBy: ScraperTrigger.Manual,
    ...timestampsStub(),
})
