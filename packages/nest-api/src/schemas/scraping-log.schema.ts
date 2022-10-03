import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ListingOrigin, ScraperTrigger, IScrapingLog } from '@wille430/common'
import { Document } from 'mongoose'

export type ScrapingLogDocument = ScrapingLog & Document

@Schema({
    id: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
})
export class ScrapingLog implements IScrapingLog {
    id!: string

    @Prop(Number)
    addedCount!: number

    @Prop(Number)
    errorCount!: number

    @Prop(String)
    entryPoint!: string

    @Prop(String)
    scrapeToId!: string

    @Prop(Date)
    scrapeToDate!: Date

    @Prop({
        type: String,
        enum: ListingOrigin,
    })
    target!: ListingOrigin

    @Prop({
        type: String,
        enum: ScraperTrigger,
    })
    triggeredBy!: ScraperTrigger

    createdAt!: Date
    updatedAt!: Date
}

export const ScrapingLogSchema = SchemaFactory.createForClass(ScrapingLog)
