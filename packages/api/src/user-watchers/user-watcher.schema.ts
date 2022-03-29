import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Document } from 'mongoose'
import { Watcher } from '@/watchers/watcher.schema'

export type UserWatcherDocument = UserWatcher & Document

@Schema({
    timestamps: true,
})
export class UserWatcher {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Watcher.name })
    _id: string

    @Prop({ default: null })
    notifiedAt: string
}

export const UserWatcherSchema = SchemaFactory.createForClass(UserWatcher)
