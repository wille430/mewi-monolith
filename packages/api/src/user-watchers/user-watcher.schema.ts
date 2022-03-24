import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserWatcherDocument = UserWatcher & Document

@Schema({
  timestamps: true,
})
export class UserWatcher {
  _id: string

  @Prop()
  notifiedAt: string
}

export const UserWatcherSchema = SchemaFactory.createForClass(UserWatcher)
