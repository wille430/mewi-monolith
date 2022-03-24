import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { FindAllListingsDto } from 'listings/dto/find-all-listing.dto'
import { Document } from 'mongoose'
import { Schema as MongooseSchema } from 'mongoose'

export type WatcherDocument = Watcher & Document

@Schema({
  timestamps: true,
})
export class Watcher {
  _id: string

  @Prop({
    type: FindAllListingsDto,
    required: true,
    unique: true,
  })
  metadata: typeof FindAllListingsDto

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user' })
  @Prop()
  notifiedAt: string
}

export const UserWatcherSchema = SchemaFactory.createForClass(Watcher)
