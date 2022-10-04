import { faker } from '@faker-js/faker'
import { IUser, LoginStrategy, Role } from '@wille430/common'

export const createFakeUser = (overrides: Partial<IUser>): IUser => ({
    id: faker.database.mongodbObjectId(),
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(32),
    roles: [Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: faker.datatype.boolean(),
    likedListings: [],
    ...overrides,
})
