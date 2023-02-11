import type {Document} from 'mongoose'
import {Currency, Category, ListingOrigin} from '@/common/schemas'
import {getModelForClass, prop} from '@typegoose/typegoose'
import {ListingDto} from "@mewi/models"

export type ListingDocument = Listing & Document

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
        required: true,
        type: String,
        validate:
            /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/,
    })
    redirectUrl!: string

    @prop({
        type: [String],
        required: true,
        default: [],
    })
    imageUrl!: string[]

    @prop({
        type: Price,
        _id: false,
    })
    price?: Price

    @prop(String)
    region?: string

    @prop({
        _id: false,
        type: Parameter,
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

    public convertToDto(this: ListingDocument): ListingDto {
        return {
            id: this._id.toString(),
            auctionEnd: this.auctionEnd,
            body: this.body,
            category: this.category,
            date: this.date,
            imageUrl: this.imageUrl,
            isAuction: this.isAuction,
            origin: this.origin,
            parameters: this.parameters,
            price: this.price,
            redirectUrl: this.redirectUrl,
            region: this.region,
            title: this.title
        }
    }

    public static convertToDto(obj: ListingDocument): ListingDto {
        return {
            id: obj._id.toString(),
            auctionEnd: obj.auctionEnd,
            body: obj.body,
            category: obj.category,
            date: obj.date,
            imageUrl: obj.imageUrl,
            isAuction: obj.isAuction,
            origin: obj.origin,
            parameters: obj.parameters,
            price: obj.price,
            redirectUrl: obj.redirectUrl,
            region: obj.region,
            title: obj.title
        }
    }
}

export const ListingModel = getModelForClass(Listing, {
    schemaOptions: {
        id: true,
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
    },
})
