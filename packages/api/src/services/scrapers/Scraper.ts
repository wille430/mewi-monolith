import { ItemData } from 'types/types'
import { toUnixTime, toDateObj } from '@mewi/util'
import EndDate from '../EndDate'
import ItemsService from '../ItemsService'

export default class Scraper {
    maxEntries: number
    name: string
    limit: number
    endDate: number

    constructor({
        maxEntries = 50,
        name,
        limit = 20
    }) {
        this.maxEntries = maxEntries
        this.name = name
        this.limit = limit

        this.endDate = toUnixTime(EndDate.getEndDateFor(this.name))
    }

    async start() {
        let itemCount = 0
        let continueScraping = true

        // Loop for each page until max entries are met
        while (itemCount < this.maxEntries && continueScraping) {
            // Get items from page (child function)
            let items = await this.getNextArticles()

            // Filter out old articles
            if (this.endDate) {
                items = items.filter(item => {
                    const differenceMs = item.date - this.endDate
                    return differenceMs > 0
                })
            }

            const summary = this.summary(items)

            if (itemCount == 0) {
                EndDate.setEndDateFor(this.name, Date.now())
            }

            // Assign loop-validators new values
            continueScraping = summary.continue

            itemCount += await ItemsService.addItems(items).catch((e) => {
                console.log(e)
                return 0
            })
            
        }

        console.log(`Added ${itemCount} items from ${this.name}`)
    }

    async getNextArticles(): Promise<ItemData[]> {
        return []
    }

    summary(items: any[]) {
        return {
            itemsAdded: items.length,
            firstDate: items[0]?.date ? toDateObj(items[0].date) : toDateObj(Date.now()),
            continue: !(items.length < this.limit)
        }
    }
}