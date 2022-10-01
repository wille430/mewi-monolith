import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { WatcherMetadata } from './class/WatcherMetadata'

export type WatcherDocument = Watcher & Document

@Schema({
    id: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})
export class Watcher {
    id!: string

    // TODO: define metadata
    @Prop({
        type: WatcherMetadata,
        default: {},
    })
    metadata!: WatcherMetadata

    @Prop(Date)
    notifiedAt?: Date
}

export const WatcherSchema = SchemaFactory.createForClass(Watcher)
