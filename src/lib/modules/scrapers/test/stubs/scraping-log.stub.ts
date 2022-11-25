import { faker } from '@faker-js/faker'
import type { WithId } from 'mongodb'
import mongoose from 'mongoose'
import { ScrapingLog } from '@/lib/modules/schemas/scraping-log.schema'
import { listingStub } from '@/lib/modules/listings/test/stubs/listing.stub'
import { timestampsStub } from '@/test/stubs/timestamps.stub'

const id = faker.database.mongodbObjectId()
export const scrapingLogStub = (): WithId<ScrapingLog> => ({
    _id: new mongoose.Types.ObjectId(id),
    id: id,
    addedCount: 1,
    entryPoint: listingStub().entryPoint,
    errorCount: 0,
    scrapeToDate: listingStub().date,
    scrapeToId: listingStub().origin_id,
    origin: listingStub().origin,
    ...timestampsStub(),
})
