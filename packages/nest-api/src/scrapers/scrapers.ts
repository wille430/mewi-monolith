import { BlippScraper } from './scrapers/blipp.scraper'
import { BlocketScraper } from './scrapers/blocket.scraper'
import { CitiboardScraper } from './scrapers/citiboard.scraper'
import { SellpyScraper } from './scrapers/sellpy.scraper'
import { TraderaScraper } from './scrapers/tradera.scraper'

const Scrapers = [BlippScraper, TraderaScraper, SellpyScraper, BlocketScraper, CitiboardScraper]

export default Scrapers
