import { ListingScraper } from '@/scrapers/classes/__mocks__/ListingScraper'
import faker from '@faker-js/faker'
import { ListingOrigin } from '@wille430/common'

export const TraderaScraper = jest.fn().mockReturnValue({
    ...new ListingScraper(),
    origin: ListingOrigin.Tradera,
    getCategories: jest.fn().mockResolvedValue(
        Array(2)
            .fill(null)
            .map((o) => ({ href: '/' + faker.commerce.department().toLowerCase() } as any))
    ),
})
