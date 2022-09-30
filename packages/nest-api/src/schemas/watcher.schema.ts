import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { WatcherMetadata } from './class/WatcherMetadata'
import { UserWatcher } from './user-watcher.schema'

export type WatcherDocument = Watcher & Document

@Schema({
    id: true,
    timestamps: true,
})
export class Watcher {
    id!: string

    // TODO: define metadata
    @Prop({
        type: WatcherMetadata,
        default: {},
    })
    metadata!: WatcherMetadata

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserWatcher' }],
        required: true,
        default: [],
    })
    userWatchers!: UserWatcher[]

    @Prop(Date)
    notifiedAt?: Date
}

export const WatcherSchema = SchemaFactory.createForClass(Watcher)
