import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Role } from '@/auth/role.enum'
import mongoose from 'mongoose'
import { Document } from 'mongoose'
import { UserWatcher, UserWatcherSchema } from '@/user-watchers/user-watcher.schema'
import { v4 as uuidv4 } from 'uuid'
import { IUser } from '@mewi/common/types'

export type UserDocument = User & Document

@Schema()
export class User implements Omit<IUser, 'watchers'> {

    _id: string

    @Prop({ type: String })
    email: string

    @Prop({ type: String, select: false })
    password?: string

    @Prop({ type: Boolean, default: false })
    premium: boolean

    @Prop({ type: [UserWatcherSchema], default: [] })
    //   TODO: FIX CORRECT TYPE
    watchers: mongoose.Types.DocumentArray<UserWatcher>

    @Prop({ type: String, default: uuidv4(), select: false })
    passwordResetSecret: string

    @Prop({ type: [String], enum: Role, default: [Role.User] })
    roles: Role[]
}

export const UserSchema = SchemaFactory.createForClass(User)
