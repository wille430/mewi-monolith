import { faker } from '@faker-js/faker'
import _ from 'lodash'
import { Category, Currency, ListingOrigin, Prisma } from '@mewi/prisma'
import { createFactory } from './createFactory'

export const ListingFactory = createFactory<Prisma.ListingCreateInput>({
    id: faker.database.mongodbObjectId,
    origin_id: () => faker.random.alphaNumeric(16),
    title: faker.commerce.product,
    // auctionEnd: isAuction ? faker.date.future(1) : undefined,
    isAuction: faker.datatype.boolean,
    body: () => faker.lorem.paragraph(faker.datatype.number(5)),
    category: () => _.sample(Object.values(Category)) ?? Category.OVRIGT,
    date: () => faker.date.past(1).toISOString(),
    entryPoint: () => '/' + faker.internet.domainWord(),
    imageUrl: () =>
        faker.helpers.maybe(() => ({ set: faker.image.abstract(480, 480) }), {
            probability: 0.7,
        }) ?? undefined,
    origin: () => _.sample(Object.values(ListingOrigin)) ?? ListingOrigin.Blocket,
    price: () => ({
        set: {
            value: faker.datatype.number({
                min: 10,
                max: 9999999,
                precision: 0.5,
            }),
            currency: _.sample(Object.values(Currency)) ?? Currency.SEK,
        },
    }),
    redirectUrl: () => faker.internet.url(),
    region: () => faker.helpers.maybe(faker.address.county),
})
