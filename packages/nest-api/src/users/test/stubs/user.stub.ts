import { LoginStrategy } from '@/schemas/enums/LoginStrategy'
import { Role } from '@/schemas/enums/UserRole'
import { User } from '@/schemas/user.schema'
import { ObjectId } from 'bson'

export const userStub = (): User & { password: string } => ({
    _id: new ObjectId('6330360f919579b678e3d048'),
    id: '6330360f919579b678e3d048',
    email: 'Ike.Carroll@hotmail.com',
    password: 'wimxf5kxjzg1mgczzvj2iwgjlgwx4cbh',
    roles: [Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: true,
    watchers: [],
    likedListings: [],
})
