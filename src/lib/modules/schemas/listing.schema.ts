import type { Document } from 'mongoose'
import { Currency, Category, ListingOrigin } from '@/common/schemas'
import { getModelForClass, index, prop } from '@typegoose/typegoose'

export type ListingDocument = Listing & Document

@index({
    keyword: 1,
})
export class Price {
    @prop({
        required: true,
    })
    value!: number

    @prop({
        enum: Currency,
        type: String,
        required: true,
    })
    currency!: Currency
}

export class Parameter {
    @prop()
    label!: string

    @prop()
    value!: string
}

export class Listing {
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
    price?: Price

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
