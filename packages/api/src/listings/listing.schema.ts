import { Category, IListing, ListingOrigins } from '@wille430/common'
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ListingDocument = Listing & Document

@Schema()
export class Listing implements IListing {
    @Prop({ type: String, unique: true })
    id: string

    @Prop({ type: String })
    title: string

    @Prop({ type: String })
    body?: string

    @Prop({ type: [String], enum: Category, default: [Category.OVRIGT] })
    category: Category[]

    @Prop({ type: Number })
    date: number

    @Prop({ type: String })
    redirectUrl: string

    @Prop({ type: [String] })
    imageUrl: string[]

    @Prop({
        type: raw({
            value: { type: String },
            currency: { type: String },
        }),
    })
    price?: {
        value: number
        currency: string
    }

    @Prop({ type: String })
    region?: string

    @Prop({
        type: [
            raw({
                label: { type: String },
                value: { type: String },
            }),
        ],
    })
    parameters: { label: string; value: string }[]

    @Prop({ type: String, enum: ListingOrigins })
    origin: IListing['origin']

    @Prop({ type: Boolean, default: false })
    isAuction: boolean

    @Prop({
        type: Number,
    })
    endDate?: number
}

export const ListingSchema = SchemaFactory.createForClass(Listing)

ListingSchema.index({ title: 'text' })
