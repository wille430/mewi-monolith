import { ItemData } from '@mewi/types'
import Scraper from 'services/scrapers/Scraper'
import puppeteer from 'puppeteer'

class BlippScraper extends Scraper {
    currentPage = 1
    maxPages?: number
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

    /**
     *
     * @param {number} pageNum >= 1
     * @returns Array of items
     */
    async getArticlesOnPage(pageNum: number): Promise<ItemData[]> {
        const url = `https://bilar.blipp.se/vara-bilar/page/${pageNum}/`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.goto(url)

        const listings = await page.waitForSelector('#listings-result')

        let gridItems = await listings.$$eval('.listing_is_active', (eles) => {
            return eles.map<ItemData | undefined>((ele) => {
                const item: Partial<ItemData> = {
                    _id: `blipp-${ele
                        .querySelector('.car-title')
                        .textContent.replace('\n', '')
                        .match(/\S+/g)
                        .join('-')
                        .trim()
                        .toLowerCase()}`,
                    title: ele
                        .querySelector('.car-title')
                        .textContent.match(/\S+/g)
                        .join(' ')
                        .trim(),
                    category: ['fordon', 'bilar'],
                    date: Date.now(),
                    imageUrl: ele.querySelector('.image')
                        ? [ele.querySelector('.image img').getAttribute('src')]
                        : [],
                    isAuction: false,
                    redirectUrl: ele.querySelector('a').getAttribute('href'),
                    price: {
                        value: parseInt(
                            ele.querySelector('.sale-price').textContent.replace(' ', '')
                        ),
                        currency: 'kr',
                    },
                    region: ele.querySelector('.car-meta-bottom ul > li > span').textContent,
                    origin: 'Blipp',
                }

                if (
                    !item._id ||
                    !item.title ||
                    !item.redirectUrl ||
                    !item.price.value ||
                    !item.region
                ) {
                    return undefined
                }

                return item as ItemData
            })
        })

        gridItems = gridItems.filter((x) => !!x)

        return gridItems
    }

    async getNextArticles(): Promise<ItemData[]> {
        if (!this.maxPages) {
            this.maxPages = await this.numberOfPages()
        }

        if (this.currentPage > this.maxPages) {
            return []
        }

        const items = await this.getArticlesOnPage(this.currentPage)

        this.currentPage += 1

        return items
    }
}

export default BlippScraper
