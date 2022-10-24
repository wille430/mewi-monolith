import { getModelForClass, prop } from '@typegoose/typegoose'
import type { IWatcherMetadata } from '@wille430/common'
import type { Document } from 'mongoose'
import { WatcherMetadata } from './class/WatcherMetadata'

export type WatcherDocument = Watcher & Document

export class Watcher {
    // TODO: define metadata
    @prop({
        type: WatcherMetadata,
        default: {},
    })
    metadata!: IWatcherMetadata

    @prop(Date)
    notifiedAt?: Date
}

export const WatcherModel = getModelForClass(Watcher, {
    schemaOptions: {
        id: true,
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
})
