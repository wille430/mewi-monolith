import { ItemData } from '@mewi/types'
import Scraper from './Scraper'
import puppeteer from 'puppeteer'

class BlippScraper extends Scraper {
    scrapeUrl = 'https://bilar.blipp.se/vara-bilar/'

    constructor(maxEntries?: number) {
        super({
            maxEntries,
            limit: 9,
            name: 'blipp',
            baseUrl: 'https://blipp.se/',
            useRobots: true,
        })
    }

    /**
     * Get the number of pages of products that are available
     */
    async numberOfPages(): Promise<number> {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto(this.scrapeUrl)

        // wait for items
        const listings = await page.waitForSelector('#listings-result')

        const pageCount = await listings.$$eval('li > a', (elements) => {
            return elements[elements.length - 2].textContent
        })

        return parseInt(pageCount)
    }

    async getNextArticles(): Promise<ItemData[]> {
        return []
    }
}

export default BlippScraper
