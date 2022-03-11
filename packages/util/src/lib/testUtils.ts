import faker from '@faker-js/faker'
import { categories, ItemData, UserData } from '@mewi/types'
import _ from 'lodash'

export const randomEmail = () => {
    return `${faker.name.firstName()}@${faker.name.lastName()}@${faker.internet.domainName()}`
}

/**
 * Generate fake item data
 * @param count How many items should be generated?
 * @param data Data that should overwrite generated data
 * @returns Array of items
 */
export const generateMockItemData = (
    count = 1,
    data?: Partial<ItemData>
): ItemData | ItemData[] => {
    const items: ItemData[] = []

    while (items.length < count) {
        items.push({
            id: faker.datatype.uuid(),
            title: faker.random.words(5),
            category: [_.sample(Object.keys(categories)) || 'fordon'],
            imageUrl: [faker.internet.url()],
            isAuction: faker.datatype.boolean(),
            redirectUrl: faker.internet.url(),
            region: faker.address.cityName(),
            origin: 'Tradera',
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

export const generateMockUserData = (): UserData => ({
    _id: faker.datatype.uuid(),
    email: randomEmail(),
    password: faker.datatype.uuid(),
    premium: faker.datatype.boolean(),
    watchers: [],
    passwordResetSecret: faker.random.alpha({ count: 256 }),
})
