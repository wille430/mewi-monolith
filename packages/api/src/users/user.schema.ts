import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Role } from 'auth/role.enum'
import { Document } from 'mongoose'
import { UserWatcher, UserWatcherSchema } from 'user-watchers/user-watcher.schema'
import { v4 as uuidv4 } from 'uuid'

export type UserDocument = User & Document

@Schema()
export class User {
  _id: string

  @Prop()
  email: string

  @Prop({ select: false })
  password?: string

  @Prop()
  premium: boolean

  @Prop([UserWatcherSchema])
  //   TODO: FIX CORRECT TYPE
  watchers: UserWatcher[]

  @Prop({ default: uuidv4(), select: false })
  passwordResetSecret?: string

  @Prop({ type: [String], default: [Role.User] })
  roles: Role[]
}

export const UserSchema = SchemaFactory.createForClass(User)
