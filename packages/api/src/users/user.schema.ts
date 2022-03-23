import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export type UserDocument = User & Document

@Schema()
export class User {
  _id: string

  @Prop()
  email: string

  @Prop()
  password: string

  @Prop()
  premium: boolean

  @Prop()
  //   TODO: FIX CORRECT TYPE
  watchers: []

  @Prop({ default: uuidv4() })
  passwordResetSecret: string
}

export const UserSchema = SchemaFactory.createForClass(User)
