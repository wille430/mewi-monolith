import { LoginStrategy } from './enums/login-strategy.enum'
import { Role } from './enums/user-role.enum'
import { IEmailUpdate } from './IEmailUpdate'
import { IListing } from './IListing'
import { IPasswordReset } from './IPasswordReset'

export interface IUser {
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
