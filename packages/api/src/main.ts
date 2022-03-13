import { toUnixTime } from '@mewi/util'
import EndDate from './services/EndDate'
import ScrapeService from './services/scrapers/ScrapeService'
import ItemsService from './services/ItemsService'
import app from './routes/app'
import WatcherNotificationService from 'services/WatcherNotificationService'
import * as dotenv from 'dotenv'
import SearchService from 'services/SearchService'
import ListingModel from 'models/ListingModel'

dotenv.config()

console.log('NODE ENV:', process.env.NODE_ENV)
;(async () => {
    const scraper = new ScrapeService()
    scraper.schedule()

    // TODO: Add fake data in development

    if (process.env.NODE_ENV === 'production') {
        const lastScan = EndDate.getEndDateFor('blocket')
        if (Date.now() - toUnixTime(lastScan) > 30 * 60 * 1000) {
            const scraper = new ScrapeService()
            scraper.start().then(async () => {
                await ItemsService.deleteOld()

                // Notify users of new items
                await WatcherNotificationService.notifyUsers()
            })
        }
    } else {
        const listingCount = await ListingModel.count()
        const maxListingCount = 10000

        if (listingCount < maxListingCount) {
            console.log(`Adding ${maxListingCount - listingCount} mock listings...`)
            await SearchService.populateWithMockData(maxListingCount - listingCount)
        }
    }

    WatcherNotificationService.notifyUsers()
})()

app.listen(3001, () => console.log('Listening on port 3001...'))
