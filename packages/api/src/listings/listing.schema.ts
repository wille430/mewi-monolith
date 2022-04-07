import { Category, IListing, ListingOrigins } from '@wille430/common/types'
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ListingDocument = Listing & Document

@Schema()
export class Listing implements IListing {
    @Prop({ unique: true })
    id: string

    @Prop(String)
    title: string

    @Prop(String)
    body?: string

    @Prop({ type: [String], enum: Category, default: [Category.OVRIGT] })
    category: Category[]

    @Prop(Number)
    date: number

    @Prop(String)
    redirectUrl: string

    @Prop([String])
    imageUrl: string[]

    @Prop(
        raw({
            value: { type: String },
            currency: { type: String },
        })
    )
    price?: {
        value: number
        currency: string
    }

    @Prop(String)
    region?: string

    @Prop([
        raw({
            label: { type: String },
            value: { type: String },
        }),
    ])
    parameters: { label: string; value: string }[]

    @Prop({ type: String, enum: ListingOrigins })
    origin: IListing['origin']

    @Prop({ type: Boolean, default: false })
    isAuction: boolean

    @Prop(Number)
    endDate?: number
}

export const ListingSchema = SchemaFactory.createForClass(Listing)

ListingSchema.index({ title: 'text' })
