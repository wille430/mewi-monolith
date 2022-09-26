import { LoginStrategy } from '@/schemas/enums/LoginStrategy'
import { Role } from '@/schemas/enums/UserRole'
import { User } from '@/schemas/user.schema'
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

const id = '6330360f919579b678e3d048'
export const userStub = (): WithId<User> & { password: string } => ({
    _id: new mongoose.Types.ObjectId(id),
    id: id,
    email: 'ike.carroll@hotmail.com',
    password: 'wimxf5kxjzg1mgczzvj2iwgjlgwx4cbh',
    roles: [Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: true,
    likedListings: [],
})

const expiration = new Date()

export const emailUpdateStub = (): User['emailUpdate'] => ({
    expiration: new Date(expiration.getTime() + 99999),
    newEmail: 'newemail@hotmail.com',
    tokenHash: 'iybb894zzs6fwedprbew5nwmpcddp6wq',
})
