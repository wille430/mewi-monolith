import { LoginStrategy, Role } from '@wille430/common'
import type { WithId } from 'mongodb'
import mongoose from 'mongoose'
import type { User } from '@/schemas/user.schema'
import { timestampsStub } from '@/common/test/stubs/timestamps.stub'

const id = '633036188f8fd81317025659'
export const adminStub = (): WithId<User> & { password: string } => ({
    _id: new mongoose.Types.ObjectId(id),
    id: id,
    email: 'admin@mewi.se',
    password: 'wimxf5kxjzg1mgczzvj2iwgjlgwx4cbh',
    roles: [Role.ADMIN, Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: true,
    likedListings: [],
    ...timestampsStub(),
})
