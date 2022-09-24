import { LoginStrategy } from '@/schemas/enums/LoginStrategy'
import { Role } from '@/schemas/enums/UserRole'
import { User } from '@/schemas/user.schema'
import faker from '@faker-js/faker'

export const userStub = (): User & { password: string } => ({
    id: '481e3a36dcf76e54eadf0a33',
    email: 'Ike.Carroll@hotmail.com',
    password: 'wimxf5kxjzg1mgczzvj2iwgjlgwx4cbh',
    roles: [Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: true,
    watchers: [],
    likedListings: [],
})
