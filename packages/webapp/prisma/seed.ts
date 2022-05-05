import faker from '@faker-js/faker'
import { Category, Currency, ListingOrigin, PrismaClient } from '@prisma/client'
import _ from 'lodash'

const prisma = new PrismaClient()

const main = async () => {
    const LISTING_COUNT = 100

    for (let i = 0; i < LISTING_COUNT; i++) {
        await prisma.listing.create({
            data: {
                title: faker.commerce.product(),
                body: faker.lorem.sentences(2),
                category: _.sample(Object.values(Category)),
                date: faker.date.recent(),
                redirectUrl: faker.internet.url(),
                imageUrl: [faker.internet.url()],
                price: {
                    value: faker.datatype.number({ min: 10, max: 10000 }),
                    currency: Currency.SEK,
                },
                region: faker.address.city(),
                parameters: [
                    {
                        label: faker.lorem.slug(),
                        value: faker.lorem.slug(),
                    },
                ],
                origin: _.sample(Object.values(ListingOrigin)),
                isAuction: faker.datatype.boolean(),
                auctionEnd: faker.date.recent(),
            },
        })
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
