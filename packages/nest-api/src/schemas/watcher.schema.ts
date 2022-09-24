import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { UserWatcher } from './user-watcher.schema'

export type WatcherDocument = Watcher & Document

@Schema({
    timestamps: true,
})
export class Watcher {
    // TODO: define metadata
    @Prop()
    metadata: any

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
