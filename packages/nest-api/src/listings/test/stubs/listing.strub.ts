import { Category } from '@/schemas/enums/Category'
import { Currency } from '@/schemas/enums/Currency'
import { ListingOrigin } from '@/schemas/enums/ListingOrigin'
import { Listing } from '@/schemas/listing.schema'
import faker from '@faker-js/faker'
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
})
