import { faker } from '@faker-js/faker'

export const randomEmail = () => {
    return `${faker.name.firstName()}.${faker.name.lastName()}@${faker.internet.domainName()}`.toLowerCase()
}

export const randomPassword = () => {
    return '.Abc123' + faker.random.alpha(10)
}
