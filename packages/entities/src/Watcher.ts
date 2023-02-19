import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import type { Document } from "mongoose";
import { WatcherMetadata } from "./WatcherMetadata";
import { WatcherDto } from "@mewi/models";
import { Entity } from "./Entity";

export type WatcherDocument = Watcher & Document;

export class Watcher extends Entity {

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

    public static convertToDto(obj: Watcher): WatcherDto {
        return {
          createdAt: obj.createdAt,
          id: obj._id.toString(),
          metadata: WatcherMetadata.convertToDto(obj.metadata),
          notifiedAt: obj.notifiedAt,
          updatedAt: obj.updatedAt,
        };
    }
}

export const WatcherModel: ReturnModelType<typeof Watcher> = getModelForClass(Watcher, {
    schemaOptions: {
        id: true,
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
        minimize: false,
    },
})
