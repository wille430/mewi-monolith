import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Category } from './enums/Category'
import { Currency } from './enums/Currency'
import { ListingOrigin } from './enums/ListingOrigin'

export type ListingDocument = Listing & Document

@Schema({
    id: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})
export class Listing {
    id!: string

    @Prop({
        type: String,
        required: true,
    })
    origin_id!: string

    @Prop({
        type: String,
        required: true,
    })
    title!: string

    @Prop({
        type: String,
    })
    body?: string

    @Prop({
        type: String,
        enum: Category,
        required: true,
    })
    category!: Category

    @Prop({
        type: Date,
        required: true,
    })
    date!: Date

    @Prop({
        type: String,
        required: true,
        validate:
            /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    })
    redirectUrl!: string

    @Prop({
        type: [String],
        required: true,
        default: [],
    })
    imageUrl!: string[]

    @Prop(
        raw({
            value: Number,
            currency: String,
        })
    )
    price?: {
        value: number
        currency: Currency
    }

    @Prop(String)
    region?: string

    @Prop([
        raw({
            label: String,
            value: String,
        }),
    ])
    parameters?: { label: string; value: string }[]

    @Prop({
        type: String,
        enum: ListingOrigin,
        required: true,
    })
    origin!: ListingOrigin

    @Prop({
        type: Boolean,
        default: false,
    })
    isAuction!: boolean

    @Prop(Date)
    auctionEnd?: Date
}

export const ListingSchema = SchemaFactory.createForClass(Listing)
