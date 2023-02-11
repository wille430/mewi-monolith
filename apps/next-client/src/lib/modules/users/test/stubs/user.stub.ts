import mongoose from 'mongoose'
import type {WithId} from 'mongodb'
import {LoginStrategy, Role} from '@/common/schemas'
import {User} from '@mewi/entities'
import {timestampsStub} from '@/test/stubs/timestamps.stub'

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
