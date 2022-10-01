import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { User } from './user.schema'
import { Watcher } from './watcher.schema'

export type UserWatcherDocument = UserWatcher & Document

@Schema({
    id: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})
export class UserWatcher {
    id!: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Watcher.name,
        required: true,
    })
    watcher!: Watcher

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
    })
    user!: User

    @Prop(Date)
    notifiedAt?: Date
}

export const UserWatcherSchema = SchemaFactory.createForClass(UserWatcher)
