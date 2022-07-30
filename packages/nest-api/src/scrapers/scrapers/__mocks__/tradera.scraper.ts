import faker from '@faker-js/faker'
import { vi } from 'vitest'
import { TraderaScraper } from '../tradera.scraper'

TraderaScraper.prototype.getCategories = vi.fn().mockResolvedValue(
    Array(2)
        .fill(null)
        .map((o) => ({ href: '/' + faker.commerce.department().toLowerCase() } as any))
)

export default TraderaScraper
