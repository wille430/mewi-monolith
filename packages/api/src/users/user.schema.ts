import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { LoginStrategy, Role } from '@prisma/client'
import mongoose from 'mongoose'
import { Document } from 'mongoose'
import { UserWatcher, UserWatcherSchema } from '@/user-watchers/user-watcher.schema'
import { IUser } from '@wille430/common'

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

    @Prop({ type: [String], enum: Role, default: [Role.USER] })
    roles: Role[]

    @Prop({ type: Schema, enum: LoginStrategy, default: [LoginStrategy.LOCAL] })
    loginStrategy: LoginStrategy

    @Prop({
        type: raw({
            tokenHash: String,
            expiration: Number,
        }),
        _id: false,
        select: false,
    })
    passwordReset?: {
        tokenHash: string
        expiration: number
    }

    @Prop({
        type: raw({
            newEmail: String,
            tokenHash: String,
            expiration: Number,
        }),
        _id: false,
        select: false,
    })
    emailUpdate?: {
        newEmail: string
        tokenHash: string
        expiration: number
    }
}

export const UserSchema = SchemaFactory.createForClass(User)
