import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IUserWatcher, IWatcher } from '@wille430/common'
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
export class UserWatcher implements IUserWatcher {
    id!: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Watcher.name,
        required: true,
    })
    watcher!: IWatcher

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
    })
    user!: User

    @Prop(Date)
    notifiedAt?: Date

    createdAt!: Date
    updatedAt!: Date
}

export const UserWatcherSchema = SchemaFactory.createForClass(UserWatcher)
