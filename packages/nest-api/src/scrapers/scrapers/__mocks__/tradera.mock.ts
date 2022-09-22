import faker from '@faker-js/faker'
import { TraderaScraper } from '../tradera.scraper'

TraderaScraper.prototype.getCategories = jest.fn().mockResolvedValue(
    Array(2)
        .fill(null)
        .map((o) => ({ href: '/' + faker.commerce.department().toLowerCase() } as any))
)

export default TraderaScraper
