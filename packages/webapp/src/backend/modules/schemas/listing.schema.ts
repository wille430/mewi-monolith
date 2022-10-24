import type { IListing } from '@wille430/common'
import type { Document } from 'mongoose'
import type { Currency } from '@wille430/common'
import { Category, ListingOrigin } from '@wille430/common'
import { getModelForClass, prop } from '@typegoose/typegoose'

export type ListingDocument = Listing & Document

export class Price {
    @prop()
    value!: number

    @prop()
    currency!: Currency
}

export class Parameter {
    label!: string
    value!: string
}

export class Listing implements IListing {
    id!: string

    @prop({
        type: String,
        required: true,
    })
    origin_id!: string

    @prop({
        type: String,
        required: true,
    })
    title!: string

    @prop({
        type: String,
    })
    body?: string

    @prop({
        type: String,
        enum: Category,
        required: true,
    })
    category!: Category

    @prop({
        type: Date,
        required: true,
    })
    date!: Date

    @prop({
        type: String,
        required: true,
        validate:
            /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
    })
    redirectUrl!: string

    @prop({
        type: [String],
        required: true,
        default: [],
    })
    imageUrl!: string[]

    @prop()
    price!: Price

    @prop(String)
    region?: string

    @prop({
        _id: false,
    })
    parameters?: Parameter[]

    @prop({
        type: String,
        enum: ListingOrigin,
        required: true,
    })
    origin!: ListingOrigin

    @prop({
        type: Boolean,
        default: false,
    })
    isAuction!: boolean

    @prop(Date)
    auctionEnd?: Date

    @prop({
        type: String,
        required: true,
    })
    entryPoint!: string

    createdAt!: Date
    updatedAt!: Date
}

export const ListingModel = getModelForClass(Listing, {
    schemaOptions: {
        id: true,
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
})
