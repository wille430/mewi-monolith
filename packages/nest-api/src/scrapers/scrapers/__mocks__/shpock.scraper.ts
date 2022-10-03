import { ListingScraper } from '@/scrapers/classes/__mocks__/ListingScraper'
import faker from '@faker-js/faker'
import { ListingOrigin } from '@wille430/common'

export const ShpockScraper = jest.fn().mockReturnValue({
    ...new ListingScraper(),
    origin: ListingOrigin.Shpock,
    token: Promise.resolve(faker.random.alpha(32)),
})
