import type { Ref } from '@typegoose/typegoose'
import { getModelForClass, prop } from '@typegoose/typegoose'
import { LoginStrategy, Role } from '@wille430/common'
import type { Document } from 'mongoose'
import { EmailUpdate } from './class/EmailUpdate'
import { PasswordReset } from './class/PasswordReset'
import { Listing } from './listing.schema'

export type UserDocument = User & Document

export class User {
    id!: string

    @prop({ type: String, required: true })
    email!: string

    @prop({
        type: String,
    })
    password?: string

    @prop({
        type: Boolean,
        default: false,
    })
    premium = false

    @prop({
        type: [String],
        enum: Role,
        default: [Role.USER],
    })
    roles!: Role[]

    @prop({
        type: String,
        default: LoginStrategy.LOCAL,
        enum: LoginStrategy,
    })
    loginStrategy!: LoginStrategy

    @prop({
        _id: false,
    })
    passwordReset?: PasswordReset

    @prop({
        type: EmailUpdate,
    })
    emailUpdate?: EmailUpdate

    @prop({
        default: [],
        ref: () => Listing,
    })
    likedListings!: Ref<Listing>[]

    // TODO: implement email record relation?

    createdAt!: Date
    updatedAt!: Date
}

export const UserModel = getModelForClass(User, {
    schemaOptions: {
        id: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
})
