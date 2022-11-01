import faker from '@faker-js/faker'
import { ListingOrigin } from '@wille430/common'
import { ListingScraper } from '../../classes/__mocks__/ListingScraper'

export const ShpockScraper = jest.fn().mockReturnValue({
    ...new ListingScraper(),
    origin: ListingOrigin.Shpock,
    token: Promise.resolve(faker.random.alpha(32)),
})
