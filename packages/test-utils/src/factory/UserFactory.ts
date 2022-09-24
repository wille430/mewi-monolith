import { createUserFactory } from '@mewi/prisma/factory'
import { faker } from '@faker-js/faker'
import _ from 'lodash'
import { LoginStrategy, Prisma, Role, User } from '@mewi/prisma'
import { CreateFactoryReturn } from 'prisma-factory'

export const UserFactory: CreateFactoryReturn<Prisma.UserCreateInput, User> = createUserFactory({
    id: () => faker.database.mongodbObjectId(),
    email: () => faker.internet.email(),
    password: () => faker.random.alphaNumeric(32),
    roles: {
        set: () => Role.USER,
    },
    loginStrategy: () => LoginStrategy.LOCAL,
    premium: () => faker.datatype.boolean(),
})
