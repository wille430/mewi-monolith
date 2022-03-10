import { toUnixTime } from '@mewi/util'
import EndDate from './services/EndDate'
import ScrapeService from './services/scrapers/ScrapeService'
import ItemsService from './services/ItemsService'
import app from './routes/app'
import WatcherNotificationService from 'services/WatcherNotificationService'
import Elasticsearch from 'config/elasticsearch'
import * as dotenv from 'dotenv'

dotenv.config()

console.log('NODE ENV:', process.env.NODE_ENV)
;(async () => {
    await Elasticsearch.prepare()

    const scraper = new ScrapeService()
    scraper.schedule()

    if (process.env.NODE_ENV === 'development' && (await Elasticsearch.itemsInDb()) < 10000) {
        console.log('Populating with fake data...')
        await Elasticsearch.populateWithFakeData(10000)
    }

    // if (process.env.NODE_ENV === 'production') {
    const lastScan = EndDate.getEndDateFor('blocket')
    if (Date.now() - toUnixTime(lastScan) > 30 * 60 * 1000) {
        const scraper = new ScrapeService()
        scraper.start().then(async () => {
            await ItemsService.deleteOld()

            // Notify users of new items
            await new WatcherNotificationService().notifyUsers()
        })
    }
    // }

    new WatcherNotificationService().notifyUsers()
})()

app.listen(3001, () => console.log('Listening on port 3001...'))
