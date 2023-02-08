import mongoose from 'mongoose'
import type { WithId } from 'mongodb'
import { LoginStrategy, Role } from '@/common/schemas'
import { User } from '@/lib/modules/schemas/user.schema'
import { timestampsStub } from '@/test/stubs/timestamps.stub'

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
    ...timestampsStub(),
})

const expiration = new Date()

export const emailUpdateStub = (): User['emailUpdate'] => ({
    expiration: new Date(expiration.getTime() + 99999),
    newEmail: 'newemail@hotmail.com',
    tokenHash: 'iybb894zzs6fwedprbew5nwmpcddp6wq',
})
