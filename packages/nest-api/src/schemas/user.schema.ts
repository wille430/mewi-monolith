import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IUser, LoginStrategy, Role } from '@wille430/common'
import mongoose, { Document } from 'mongoose'
import { EmailUpdate } from './class/EmailUpdate'
import { PasswordReset } from './class/PasswordReset'
import { Listing } from './listing.schema'

export type UserDocument = User & Document

@Schema({
    id: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})
export class User implements IUser {
    id!: string

    @Prop({ type: String, required: true })
    email!: string

    @Prop({
        type: String,
    })
    password?: string

    @Prop({
        type: Boolean,
        default: false,
    })
    premium: boolean = false

    @Prop({
        type: [String],
        enum: Role,
        default: [Role.USER],
    })
    roles!: Role[]

    @Prop({
        type: String,
        default: LoginStrategy.LOCAL,
        enum: LoginStrategy,
    })
    loginStrategy!: LoginStrategy

    @Prop({
        type: PasswordReset,
    })
    passwordReset?: PasswordReset

    @Prop({
        type: EmailUpdate,
    })
    emailUpdate?: EmailUpdate

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
        default: [],
    })
    likedListings!: Listing[]

    // TODO: implement email record relation?

    createdAt!: Date
    updatedAt!: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
