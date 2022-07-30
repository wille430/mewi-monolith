import { Prisma, Category, ListingOrigin, Currency, Listing } from '@mewi/prisma'
import { createListingFactory } from '@mewi/prisma/factory'
import _ from 'lodash'
import faker from '@faker-js/faker'

export const createListing = (defaults: Partial<Listing>) => {
    const CreateListingFactory = createListingFactory({})

    return CreateListingFactory.create({
        title: faker.commerce.productName(),
        category: _.sample(Object.keys(Category)) as Category,
        entryPoint: faker.random.word(),
        origin: _.sample(Object.keys(ListingOrigin)) as ListingOrigin,
        origin_id: faker.random.alpha(16),
        redirectUrl: faker.internet.url(),
        ...defaults,
    } as Prisma.ListingCreateInput)
}
