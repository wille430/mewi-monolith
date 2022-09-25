import { LoginStrategy } from '@/schemas/enums/LoginStrategy'
import { Role } from '@/schemas/enums/UserRole'
import { User } from '@/schemas/user.schema'
import { ObjectId } from 'bson'

export const adminStub = (): User & { password: string } => ({
    _id: new ObjectId('633036188f8fd81317025659'),
    id: '633036188f8fd81317025659',
    email: 'admin@mewi.se',
    password: 'wimxf5kxjzg1mgczzvj2iwgjlgwx4cbh',
    roles: [Role.ADMIN, Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: true,
    watchers: [],
    likedListings: [],
})
