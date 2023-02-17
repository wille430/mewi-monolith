import {Role} from "./UserRole"
import {LoginStrategy} from "./LoginStrategy"
import {IEntity} from "./IEntity"

export interface IPasswordReset {
    tokenHash: string
    expiration: number
}

export interface IEmailUpdate {
    newEmail: string
    tokenHash: string
    expiration: Date
}

export interface UserDto extends IEntity {
    id: string
    email: string
    password?: string
    premium: boolean
    roles: Role[]
    loginStrategy: LoginStrategy
    passwordReset?: IPasswordReset
    emailUpdate?: IEmailUpdate
    likedListings: string[]
}
