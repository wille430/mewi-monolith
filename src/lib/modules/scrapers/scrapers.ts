import { BilwebScraper } from './scrapers/bilweb.scraper'
import { BlippScraper } from './scrapers/blipp.scraper'
import { BlocketScraper } from './scrapers/blocket.scraper'
import { BytbilScraper } from './scrapers/bytbil.scraper'
import { CitiboardScraper } from './scrapers/citiboard.scraper'
import { KvdbilScraper } from './scrapers/kvdbil.scraper'
import { SellpyScraper } from './scrapers/sellpy.scraper'
import { ShpockScraper } from './scrapers/shpock.scraper'
import { TraderaScraper } from './scrapers/tradera.scraper'

const Scrapers = [
    BlippScraper,
    TraderaScraper,
    SellpyScraper,
    BlocketScraper,
    CitiboardScraper,
    ShpockScraper,
    BytbilScraper,
    KvdbilScraper,
    BilwebScraper,
]

export default Scrapers