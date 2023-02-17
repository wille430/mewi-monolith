import {faker} from '@faker-js/faker'
import { Listing } from '@mewi/entities'
import {Category, ListingOrigin} from "@mewi/models"

export const createFakeListing = (overrides: Partial<Listing> = {}): Listing => {
    const origin = faker.helpers.arrayElement(Object.values(ListingOrigin))

    return {
        id: faker.database.mongodbObjectId(),
        title: `${faker.commerce.productAdjective()} ${faker.commerce.product().toLowerCase()}`,
        body: faker.commerce.productDescription(),
        category: faker.helpers.arrayElement(Object.values(Category)),
        date: faker.date.recent(),
        origin_id: `${origin.toLowerCase()}-${faker.random.alphaNumeric(16)}` as string,
        imageUrl: [],
        isAuction: faker.datatype.boolean(),
        origin: origin,
        redirectUrl: faker.internet.url(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        ...overrides,
    } as Listing
}
