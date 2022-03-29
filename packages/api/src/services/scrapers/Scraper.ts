import { ItemData } from '@mewi/common'
import { toUnixTime } from '@mewi/common/utils'
import axios from 'axios'
import EndDate from '../EndDate'
import ItemsService from '../ItemsService'
import robotsParser from 'robots-parser'
import nodeSchedule from 'node-schedule'
import ListingModel from 'models/ListingModel'

interface ScraperProps {
    maxEntries?: number
    name: string
    limit?: number
    baseUrl: string
    useRobots?: boolean
}

class Scraper {
    maxEntries: number
    itemsAdded = 0
    name: string
    limit: number
    endDate: number
    baseUrl: string
    useRobots: boolean
    deleteOlderThan: number = Date.now() - 2 * 24 * 60 * 60 * 1000
    cronTimerSchedule = '30 * * * *'

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

    shouldContinueScraping() {
        if (this.itemsAdded >= this.maxEntries) {
            return false
        } else {
            return true
        }
    }

    async start() {
        // check robots
        await this.checkRobots()
        if (!this.canCrawl) {
            console.warn('Webcrawling not allowed for', this.baseUrl)
            return
        }

        let continueScraping = true

        // Loop for each page until max entries are met
        while (continueScraping) {
            // Get items from page (child function)
            let items = await this.getNextArticles()

            // Filter out old articles
            if (this.endDate) {
                items = items.filter((item) => {
                    const differenceMs = item.date - this.endDate
                    return differenceMs > 0
                })
            }

            if (this.itemsAdded === 0) {
                EndDate.setEndDateFor(this.name, Date.now())
            }

            continueScraping = this.shouldContinueScraping()

            // Assign loop-validators new values
            await ItemsService.addItems(items)
                .then((val) => {
                    this.itemsAdded += val

                    if (val <= 0) {
                        continueScraping = false
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        }

        console.log(`Added ${this.itemsAdded} items from ${this.name}`)
    }

    async getNextArticles(): Promise<ItemData[]> {
        return []
    }

    schedule(callback?: () => void): void {
        console.log(`Scheduling scraper for ${this.name} with schedule (${this.cronTimerSchedule})`)
        nodeSchedule.scheduleJob(this.cronTimerSchedule, () => {
            this.start().then(async () => {
                await this.deleteOld()
                callback && callback()
            })
        })
    }

    async deleteOld(): Promise<void> {
        const { deletedCount } = await ListingModel.deleteMany({
            date: { $lte: this.deleteOlderThan },
        })

        console.log(`Successfully deleted ${deletedCount} items with origin ${this.name}`)
    }
}

export default Scraper
