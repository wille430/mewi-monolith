import faker from '@faker-js/faker'
import { timestampsStub } from '@mewi/test-utils'
import { ScraperTrigger } from '@wille430/common'
import type { WithId } from 'mongodb'
import mongoose from 'mongoose'
import { ScrapingLog } from '@/backend/modules/schemas/scraping-log.schema'
import { listingStub } from '@/backend/modules/listings/test/stubs/listing.stub'

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
