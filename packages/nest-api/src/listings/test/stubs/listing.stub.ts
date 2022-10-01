import { Listing } from '@/schemas/listing.schema'
import faker from '@faker-js/faker'
import { Category, Currency, ListingOrigin } from '@wille430/common'
import { WithId } from 'mongodb'
import mongoose from 'mongoose'

const id = faker.database.mongodbObjectId()
const date = new Date()
export const listingStub = (): WithId<Listing> => ({
    _id: new mongoose.Types.ObjectId(id),
    id,
    category: Category.FORDON,
    date: date,
    imageUrl: [],
    isAuction: false,
    origin: ListingOrigin.Blocket,
    origin_id: 'blocket-dsada90r3',
    redirectUrl: 'https://www.blocket.se',
    title: 'Bil',
    price: {
        value: 100000,
        currency: Currency.SEK,
    },
    entryPoint: '/',
})
