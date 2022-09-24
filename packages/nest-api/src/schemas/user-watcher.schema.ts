import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { User } from './user.schema'
import { Watcher } from './watcher.schema'

export type UserWatcherDocument = UserWatcher & Document

@Schema({
    timestamps: true,
})
export class UserWatcher {
    @Prop({
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Watcher' },
        required: true,
    })
    watcher!: Watcher

    @Prop({
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        required: true,
    })
    user!: User

    @Prop(Date)
    notifiedAt?: Date
}

export const UserWatcherSchema = SchemaFactory.createForClass(UserWatcher)
