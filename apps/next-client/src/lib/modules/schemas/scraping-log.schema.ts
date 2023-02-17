import {getModelForClass, prop} from '@typegoose/typegoose'
import {IScrapingLog} from "@/common/schemas/IScrapingLog"
import {ListingOrigin} from "@mewi/models"

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
