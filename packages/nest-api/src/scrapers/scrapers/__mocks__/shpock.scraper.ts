import faker from '@faker-js/faker'
import { ShpockScraper } from '../shpock.scraper'

jest.spyOn(ShpockScraper.prototype, 'token', 'get').mockReturnValue(
    Promise.resolve(faker.random.alpha(32))
)

export default ShpockScraper
