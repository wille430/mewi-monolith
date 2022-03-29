import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import mongoose from 'mongoose'
import { Document } from 'mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { UserWatcher } from '@/user-watchers/user-watcher.schema'

export type WatcherDocument = Watcher & Document

export interface PopulatedWatcher extends Pick<Watcher, 'metadata'>, UserWatcher {}

@Schema({
    timestamps: true,
})
export class Watcher {
    _id: string

    @Prop({
        type: FindAllListingsDto,
        required: true,
        unique: true,
    })
    metadata: typeof FindAllListingsDto

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'user', default: [] })
    users: mongoose.Types.Array<mongoose.Types.ObjectId>

    @Prop()
    notifiedAt: string
}

export const WatcherSchema = SchemaFactory.createForClass(Watcher)
