import WatcherNotificationService from 'services/WatcherNotificationService'
import BlippScraper from './BlippScraper'
import BlocketScraper from './BlocketScraper'
import SellpyScraper from './SellpyScraper'
import TraderaScraper from './TraderaScraper'
import nodeSchedule from 'node-schedule'

export default class ScrapeService {
    scrapers = [
        new BlocketScraper(500),
        new SellpyScraper(200),
        new TraderaScraper(200),
        new BlippScraper(200),
    ]

    async start() {
        for (const scraper of this.scrapers) {
            console.log(
                `Scraping ${scraper.maxEntries} items from ${
                    scraper.name
                } which are from ${new Date(scraper.endDate)}`
            )
            await scraper.start()
        }
    }

    schedule() {
        for (const scraper of this.scrapers) {
            scraper.schedule()
        }

        // schedule email notifications
        nodeSchedule.scheduleJob('30 18 * * *', async () => {
            await WatcherNotificationService.notifyUsers()
        })
    }
}
