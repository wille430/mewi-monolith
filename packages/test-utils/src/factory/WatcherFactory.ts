import { createWatcherFactory } from '@mewi/prisma/factory'
import { faker } from '@faker-js/faker'
import _ from 'lodash'
import { Category, ListingOrigin, Prisma, Watcher } from '@mewi/prisma'
import { CreateFactoryReturn } from 'prisma-factory'

export const WatcherFactory: CreateFactoryReturn<Prisma.WatcherCreateInput, Watcher> =
    createWatcherFactory({
        id: () => faker.database.mongodbObjectId(),
        createdAt: () => faker.date.recent().toString(),
        updatedAt: () => faker.date.future(0.15, new Date()).toString(),
        metadata: () => {
            const priceRangeGte = faker.datatype.number({
                min: 10,
                max: 5000000,
                precision: 0.5,
            })
            return {
                set: {
                    keyword: faker.helpers.maybe(faker.commerce.product),
                    auction: faker.helpers.maybe(faker.datatype.boolean),
                    categories: faker.helpers.maybe(
                        () => _.sample(Object.values(Category)) ?? Category.OVRIGT
                    ),
                    origins: _.sampleSize(
                        Object.values(ListingOrigin),
                        faker.datatype.number({ min: 1, max: Object.values(ListingOrigin).length })
                    ) ?? [ListingOrigin.Blocket],
                    priceRangeLte: faker.datatype.number({
                        min: priceRangeGte,
                        max: 9999999,
                        precision: 0.5,
                    }),
                    priceRangeGte,
                    region: faker.helpers.maybe(faker.address.county),
                },
            }
        },
    })
