import { ItemData } from '@mewi/types'
import { toUnixTime } from '@mewi/util'
import axios from 'axios'
import EndDate from '../EndDate'
import ItemsService from '../ItemsService'
import robotsParser from 'robots-parser'

interface ScraperProps {
    maxEntries: number
    name: string
    limit: number
    baseUrl: string
    useRobots?: boolean
}

class Scraper {
    maxEntries: number
    name: string
    limit: number
    endDate: number
    baseUrl: string
    useRobots: boolean

    // Robots
    canCrawl = false

    constructor({ maxEntries = 50, name, limit = 20, baseUrl, useRobots = true }: ScraperProps) {
        this.maxEntries = maxEntries
        this.name = name
        this.limit = limit
        this.baseUrl = baseUrl
        this.useRobots = useRobots

        console.log(EndDate.getEndDateFor(this.name))

        this.endDate = toUnixTime(EndDate.getEndDateFor(this.name))
    }

    async checkRobots() {
        // skip if useRobots is false
        if (!this.useRobots) {
            this.canCrawl = true
            return
        }

        const robotsTxt = await axios.get(this.baseUrl).then((res) => res.data)

        const robots = robotsParser(this.baseUrl + 'robots.txt', robotsTxt)

        if (robots.isAllowed(this.baseUrl)) {
            this.canCrawl = true
        } else {
            this.canCrawl = false
        }
    }

    async start() {
        let itemCount = 0
        let continueScraping = true

        // check robots
        await this.checkRobots()
        if (!this.canCrawl) {
            console.warn('Webcrawling not allowed for', this.baseUrl)
            return
        }

        // Loop for each page until max entries are met
        while (itemCount < this.maxEntries && continueScraping) {
            // Get items from page (child function)
            let items = await this.getNextArticles()

            // Filter out old articles
            if (this.endDate) {
                items = items.filter((item) => {
                    const differenceMs = item.date - this.endDate
                    return differenceMs > 0
                })
            }

            if (itemCount === 0) {
                EndDate.setEndDateFor(this.name, Date.now())
            }

            if (items.length < this.limit) {
                continueScraping = false
            }

            // Assign loop-validators new values
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
}

export default Scraper
