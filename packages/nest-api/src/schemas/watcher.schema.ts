import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IWatcher, IWatcherMetadata } from '@wille430/common'
import { Document } from 'mongoose'
import { WatcherMetadata } from './class/WatcherMetadata'

export type WatcherDocument = Watcher & Document

@Schema({
    id: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})
export class Watcher implements IWatcher {
    id!: string

    // TODO: define metadata
    @Prop({
        type: WatcherMetadata,
        default: {},
    })
    metadata!: IWatcherMetadata

    @Prop(Date)
    notifiedAt?: Date
}

export const WatcherSchema = SchemaFactory.createForClass(Watcher)
