import schedule from 'node-schedule'
import { toUnixTime } from '@mewi/util'
import EndDate from './services/EndDate'
import ScrapeService from './services/scrapers/ScrapeService'
import ItemsService from './services/ItemsService'
import EmailService from './services/EmailService'
import app from './routes/app'

console.log("NODE ENV:", process.env.NODE_ENV)

// Scheduled jobs

// Update elasticsearch index
schedule.scheduleJob('30 * * * *', async () => {
    const scraper = new ScrapeService()
    scraper.start().then(async () => {
        await ItemsService.deleteOld()

        // Notify users of new items
        await EmailService.notifyWatchers()
    })
})

const lastScan = EndDate.getEndDateFor('blocket')
if (Date.now() - toUnixTime(lastScan) > 30 * 60 * 1000) {
    const scraper = new ScrapeService()
    scraper.start().then(async () => {
        await ItemsService.deleteOld()

        // Notify users of new items
        await EmailService.notifyWatchers()
    })
}

// const sendEmail = async () => {
//     const items = await SearchService.search({
//         query: { match: { title: 'volvo' } },
//         size: 5
//     }).then(x => x.body.hits.hits)

//     const res = await EmailService.sendEmail('william.wigemo@outlook.com', 'newItems', {
//         newItemCount: items.length,
//         keyword: 'volvo',
//         items: items.map(x => x._source)
//     })
// }

// sendEmail()

// Start app by listening on port
app.listen(3001, () => console.log('Listening on port 3001...'))
