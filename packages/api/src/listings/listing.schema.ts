import { IListing, ListingOrigins } from '@mewi/common/types'
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ListingDocument = Listing & Document

@Schema()
export class Listing implements IListing {
    @Prop()
    id: string

    @Prop()
    title: string

    @Prop()
    body?: string

    @Prop([String])
    category: string[]

    @Prop()
    date: number

    @Prop()
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

    @Prop()
    region: string

    @Prop([
        raw({
            id: { type: String },
            label: { type: String },
            value: { type: String },
        }),
    ])
    parameters: { id: string; label: string; value: string }[]

    @Prop({ type: String, enum: ListingOrigins })
    origin: IListing['origin']

    @Prop()
    isAuction: boolean

    @Prop()
    endDate: number
}

export const ListingSchema = SchemaFactory.createForClass(Listing)
