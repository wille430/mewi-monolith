import { toUnixTime } from '@mewi/util'
import EndDate from './services/EndDate'
import ScrapeService from './services/scrapers/ScrapeService'
import ItemsService from './services/ItemsService'
import app from './routes/app'
import WatcherNotificationService from 'services/WatcherNotificationService'

console.log('NODE ENV:', process.env.NODE_ENV)

const scraper = new ScrapeService()
scraper.schedule()

if (process.env.NODE_ENV === 'production') {
    const lastScan = EndDate.getEndDateFor('blocket')
    if (Date.now() - toUnixTime(lastScan) > 30 * 60 * 1000) {
        const scraper = new ScrapeService()
        scraper.start().then(async () => {
            await ItemsService.deleteOld()

            // Notify users of new items
            await new WatcherNotificationService().notifyUsers()
        })
    }
}

new WatcherNotificationService().notifyUsers()

app.listen(3001, () => console.log('Listening on port 3001...'))
