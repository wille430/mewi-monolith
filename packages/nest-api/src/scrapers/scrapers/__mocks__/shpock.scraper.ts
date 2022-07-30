import faker from '@faker-js/faker'
import { vi } from 'vitest'
import { ShpockScraper } from '../shpock.scraper'

vi.spyOn(ShpockScraper.prototype, 'token', 'get').mockReturnValue(
    Promise.resolve(faker.random.alpha(32))
)

export default ShpockScraper
