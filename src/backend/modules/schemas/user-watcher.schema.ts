import { getModelForClass, prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import type { Document } from 'mongoose'
import mongoose from 'mongoose'
import { User } from './user.schema'
import { Watcher } from './watcher.schema'

export type UserWatcherDocument = UserWatcher & Document

export class UserWatcher {
    id!: string

    @prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Watcher.name,
        required: true,
    })
    watcher!: Ref<Watcher>

    @prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
    })
    user!: User

    @prop(Date)
    notifiedAt?: Date

    createdAt!: Date
    updatedAt!: Date
}

export const UserWatcherModel = getModelForClass(UserWatcher, {
    schemaOptions: {
        id: true,
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
})
