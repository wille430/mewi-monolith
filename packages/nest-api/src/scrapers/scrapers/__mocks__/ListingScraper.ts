import { ListingScraper } from '@/scrapers/classes/ListingScraper'
import faker from '@faker-js/faker'
import { ListingOrigin } from '@mewi/prisma'
import _ from 'lodash'

export class ListingScraperMock extends ListingScraper {
    limit: number = faker.datatype.number({
        min: 20,
        max: 100,
        precision: 10,
    })
    baseUrl: string = faker.internet.url()
    origin: ListingOrigin = _.sample(ListingOrigin) ?? ListingOrigin.Blocket

    createScrapeUrl = (...args: any) => {
        return this.baseUrl
    }
}
