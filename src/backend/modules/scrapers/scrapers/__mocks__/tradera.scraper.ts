import faker from '@faker-js/faker'
import { ListingOrigin } from '@/common/schemas'
import { ListingScraper } from '../../classes/__mocks__/ListingScraper'

export const TraderaScraper = jest.fn().mockReturnValue({
    ...new ListingScraper(),
    origin: ListingOrigin.Tradera,
    getCategories: jest.fn().mockResolvedValue(
        Array(2)
            .fill(null)
            .map(() => ({ href: '/' + faker.commerce.department().toLowerCase() } as any))
    ),
})
