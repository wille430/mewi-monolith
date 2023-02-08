import { IUser, LoginStrategy, Role } from '@/common/schemas'
import { faker } from '@faker-js/faker'

export const createFakeUser = (overrides: Partial<IUser>): IUser => ({
    id: faker.database.mongodbObjectId(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(32),
    roles: [Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: faker.datatype.boolean(),
    likedListings: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
})
