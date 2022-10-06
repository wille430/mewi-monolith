import { timestampsStub } from '@/common/test/stubs/timestamps.stub'
import { listingStub } from '@/listings/test/stubs/listing.stub'
import { ScrapingLog } from '@/schemas/scraping-log.schema'
import faker from '@faker-js/faker'
import { ScraperTrigger } from '@wille430/common'
import { WithId } from 'mongodb'
import mongoose from 'mongoose'

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
