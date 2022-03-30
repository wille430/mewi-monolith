import faker from '@faker-js/faker'
import { categories, IListing, ListingOrigins, IUser } from '../types'
import _ from 'lodash'

export const randomEmail = () => {
    return `${faker.name.firstName()}@${faker.name.lastName()}@${faker.internet.domainName()}`
}

export const randomPassword = () => {
    return '.Abc123' + faker.random.alpha(10)
}

/**
 * Generate fake item data
 * @param count How many items should be generated?
 * @param data Data that should overwrite generated data
 * @returns Array of items
 */
export const generateMockItemData = (
    count = 1,
    data?: Partial<IListing>
): IListing | IListing[] => {
    const items: IListing[] = []

    while (items.length < count) {
        items.push({
            id: faker.datatype.uuid(),
            title: faker.random.words(5),
            category: [_.sample(Object.keys(categories)) || 'fordon'],
            imageUrl: [faker.internet.url()],
            isAuction: faker.datatype.boolean(),
            redirectUrl: faker.internet.url(),
            region: faker.address.cityName(),
            origin: Object.values(ListingOrigins)[
                Math.floor(Math.random() * Object.values(ListingOrigins).length)
            ],
            price: {
                value: faker.datatype.number({ min: 10, max: 9999999 }),
                currency: 'kr',
            },
            body: faker.lorem.paragraphs(),
            ...data,
        })
    }

    if (items.length > 1) {
        return items
    } else {
        return items[0]
    }
}

export const generateMockUserData = (): IUser & {
    password: string
    passwordResetSecret: string
} => ({
    _id: faker.datatype.uuid(),
    email: randomEmail(),
    password: faker.datatype.uuid(),
    premium: faker.datatype.boolean(),
    watchers: [],
    passwordResetSecret: faker.random.alpha({ count: 256 }),
})
