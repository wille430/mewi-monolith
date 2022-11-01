import { LoginStrategy } from '../enums/login-strategy.enum'
import { Role } from '../enums/user-role.enum'
import { IEmailUpdate } from './IEmailUpdate'
import { IEntity } from './IEntity'
import { IListing } from './IListing'
import { IPasswordReset } from './IPasswordReset'

export interface IUser extends IEntity {
    id: string
    email: string
    password?: string
    premium: boolean
    roles: Role[]
    loginStrategy: LoginStrategy
    passwordReset?: IPasswordReset
    emailUpdate?: IEmailUpdate
    likedListings: IListing[]
}

export type IUserLean = IUser & {
    likedListings: string[]
}
