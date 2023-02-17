import {faker} from '@faker-js/faker'
import {LoginStrategy, Role, UserDto} from "@mewi/models"

export const createFakeUser = (overrides: Partial<UserDto>): UserDto => ({
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
