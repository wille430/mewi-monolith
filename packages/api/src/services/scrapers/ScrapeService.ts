import { toDateObj } from '@mewi/util'
import BlocketScraper from './BlocketScraper'
import SellpyScraper from './SellpyScraper'
import TraderaScraper from './TraderaScraper'

export default class ScrapeService {
    scrapers = [new BlocketScraper(500), new SellpyScraper(200), new TraderaScraper(200)]

    async start() {
        for (const scraper of this.scrapers) {
            console.log(
                `Scraping ${scraper.maxEntries} items from ${
                    scraper.name
                } which are from ${toDateObj(scraper.endDate)}`
            )
            await scraper.start()
        }
    }
}
