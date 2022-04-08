import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Document } from 'mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { UserWatcher } from '@/user-watchers/user-watcher.schema'
import { IWatcher, ListingSearchFilters } from '@wille430/common'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export type WatcherDocument = Watcher & Document

export interface PopulatedWatcher extends Pick<Watcher, 'metadata'>, UserWatcher {}

export class Metadata implements ListingSearchFilters {
    @IsOptional()
    @IsString()
    keyword?: string

    @IsOptional()
    // TODO: validate
    regions?: string[] | string

    @IsOptional()
    @IsString()
    category?: string

    @IsOptional()
    @IsNumber()
    priceRangeGte?: number

    @IsOptional()
    @IsNumber()
    priceRangeLte?: number

    @IsOptional()
    @IsBoolean()
    auction?: boolean

    @IsOptional()
    @IsNumber()
    dateGte?: number
}

@Schema({
    timestamps: true,
})
export class Watcher implements Partial<IWatcher> {
    _id: string

    @Prop({
        type: Metadata,
        required: true,
    })
    metadata: ListingSearchFilters

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'user', default: [] })
    users: mongoose.Types.Array<mongoose.Types.ObjectId>
}

export const WatcherSchema = SchemaFactory.createForClass(Watcher)
