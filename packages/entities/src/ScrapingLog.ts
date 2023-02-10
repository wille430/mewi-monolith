import {getModelForClass, prop} from '@typegoose/typegoose'
import type {Document} from 'mongoose'
import {ListingOrigin} from "@mewi/models"

export type ScrapingLogDocument = ScrapingLog & Document

export class ScrapingLog {
    id!: string

    @prop(Number)
    addedCount!: number

    @prop(Number)
    errorCount!: number

    @prop(String)
    entryPoint!: string

    @prop(String)
    scrapeToId?: string

    @prop(Date)
    scrapeToDate?: Date

    @prop({
        type: String,
        enum: ListingOrigin,
    })
    origin!: ListingOrigin

    createdAt!: Date
    updatedAt!: Date
}

export const ScrapingLogModel = getModelForClass(ScrapingLog, {
    schemaOptions: {
        id: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
        timestamps: true,
    },
})
