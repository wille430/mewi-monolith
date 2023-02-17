import {getModelForClass, prop, ReturnModelType} from '@typegoose/typegoose'
import type {Ref} from '@typegoose/typegoose'
import type {Document} from 'mongoose'
import mongoose from 'mongoose'
import {Watcher} from "./Watcher"
import {User} from "./User"
import {UserWatcherDto} from "@mewi/models"

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
    user!: Ref<User>

    @prop(Date)
    notifiedAt?: Date

    createdAt!: Date
    updatedAt!: Date

    public static convertToDto(obj: UserWatcher): UserWatcherDto {
        return {
            id: obj.id,
            watcher: obj.watcher as any,
            user: obj.user as any,
            notifiedAt: obj.notifiedAt,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt
        }
    }
}

export const UserWatcherModel: ReturnModelType<typeof UserWatcher> = getModelForClass(UserWatcher, {
    schemaOptions: {
        id: true,
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
    },
})
