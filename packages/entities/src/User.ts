import type {Ref, ReturnModelType} from '@typegoose/typegoose'
import {getModelForClass, prop} from '@typegoose/typegoose'
import type {Document} from 'mongoose'
import {Listing} from "./Listing"
import {LoginStrategy, Role, UserDto} from "@mewi/models"
import {PasswordReset} from "./PasswordReset"
import {EmailUpdate} from "./EmailUpdate"
import {Entity} from "./Entity"

export type UserDocument = User & Document

export class User extends Entity {
    id!: string

    @prop({type: String, required: true})
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

    public static convertToDto(obj: User): UserDto {
        return {
            email: obj.email,
            id: obj.id,
            likedListings: obj.likedListings as any,
            loginStrategy: obj.loginStrategy,
            premium: false,
            roles: obj.roles,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt

        }
    }
}

export const UserModel: ReturnModelType<typeof User> = getModelForClass(User, {
    schemaOptions: {
        id: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
    },
})
