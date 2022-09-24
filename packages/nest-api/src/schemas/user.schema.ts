import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, SchemaType } from 'mongoose'
import { EmailUpdate } from './class/EmailUpdate'
import { PasswordReset } from './class/PasswordReset'
import { LoginStrategy } from './enums/LoginStrategy'
import { Role } from './enums/UserRole'
import { Listing } from './listing.schema'
import { UserWatcher } from './user-watcher.schema'

export type UserDocument = User & Document

@Schema()
export class User {
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
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserWatcher' }],
        default: [],
    })
    watchers!: UserWatcher[]

    @Prop({
        type: [
            {
                type: String,
                enum: Object.values(Role),
            },
        ],
        default: Role.USER,
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
}

export const UserSchema = SchemaFactory.createForClass(User)
