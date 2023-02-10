import { getModelForClass, prop } from '@typegoose/typegoose'
import type { Document } from 'mongoose'
import { WatcherMetadata } from './class/WatcherMetadata'

export type WatcherDocument = Watcher & Document

export class Watcher {

    id!: string

    // TODO: define metadata
    @prop({
        _id: false,
        required: true,
        default: {},
    })
    metadata!: WatcherMetadata

    @prop(Date)
    notifiedAt?: Date
}

export const WatcherModel = getModelForClass(Watcher, {
    schemaOptions: {
        id: true,
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        minimize: false,
    },
})