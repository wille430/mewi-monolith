import { ItemData } from '@mewi/types'
import * as mongoose from 'mongoose'

export type Listing = ItemData

export type ListingDoc = Listing & mongoose.Document

export const ListingSchema = new mongoose.Schema<Listing>({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    body: { type: String, required: false },
    category: { type: [String], required: true },
    date: { type: Number },
    redirectUrl: {
        type: String,
        required: true,
    },
    imageUrl: { type: [String], required: true },
    price: {
        value: { type: String },
        currency: { type: String },
        required: false,
    },
    region: String,
    parameters: [
        {
            id: { type: String, required: true },
            label: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    origin: { type: String, required: true },

    // auction fields
    isAuction: { type: Boolean, required: true },
    endDate: { type: Number },
})

ListingSchema.index({ title: 'text' })

export const ListingModel = mongoose.model<Listing>('listings', ListingSchema)

export default ListingModel
