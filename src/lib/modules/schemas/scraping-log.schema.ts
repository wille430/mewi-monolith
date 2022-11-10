import { getModelForClass, prop } from '@typegoose/typegoose'
import type { IScrapingLog } from '@/common/schemas'
import { ListingOrigin, ScraperTrigger } from '@/common/schemas'
import type { Document } from 'mongoose'

export type ScrapingLogDocument = ScrapingLog & Document

export class ScrapingLog implements IScrapingLog {
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
    target!: ListingOrigin

    @prop({
        type: String,
        enum: ScraperTrigger,
    })
    triggeredBy!: ScraperTrigger

    createdAt!: Date
    updatedAt!: Date
}

export const ScrapingLogModel = getModelForClass(ScrapingLog, {
    schemaOptions: {
        id: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        timestamps: true,
    },
})
