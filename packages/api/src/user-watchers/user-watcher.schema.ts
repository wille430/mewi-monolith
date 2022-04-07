import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Document } from 'mongoose'
import { Watcher } from '@/watchers/watcher.schema'
import { IUserWatcher } from '@wille430/common/types'

export type UserWatcherDocument = UserWatcher & Document

@Schema({
    timestamps: true,
})
export class UserWatcher implements Partial<IUserWatcher> {
    @Prop({ type: mongoose.Types.ObjectId, ref: Watcher.name })
    _id: string

    @Prop({ type: mongoose.Schema.Types.Date })
    notifiedAt?: string
}

export const UserWatcherSchema = SchemaFactory.createForClass(UserWatcher)
