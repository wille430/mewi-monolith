import { LoginStrategy } from '../LoginStrategy'
import { Role } from '../UserRole'
import { IEmailUpdate } from './IEmailUpdate'
import { IEntity } from './IEntity'
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
    likedListings: string[]
}

export type IUserLean = IUser & {
    likedListings: string[]
}
