import { Listing, ListingDocument } from '@/listings/listing.schema'
import { Category, ListingOrigins } from '@mewi/common/types'
import { Scraper, ScraperOptions } from './scraper'
import { Model } from 'mongoose'
import puppeteer from 'puppeteer'

export class BlippScraper extends Scraper {
    currentPage = 1
    maxPages?: number
    scrapeUrl = 'https://bilar.blipp.se/vara-bilar/'
    useRobots = true

    constructor(listingModel: Model<ListingDocument>, options?: ScraperOptions) {
        super(listingModel, ListingOrigins.Blipp, 'https://www.blipp.se/', options ?? {})
    }

    /**
     * Get the number of pages of products that are available
     */
    async numberOfPages(): Promise<number> {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
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
     * @param pageNum - the apge to scrape. pageNum \>= 1
     * @returns An array of listings
     */
    async getListingOnPage(pageNum: number): Promise<Listing[]> {
        try {
            const url = `https://bilar.blipp.se/vara-bilar/page/${pageNum}/`

            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            })
            const page = await browser.newPage()

            await page.goto(url)

            const listingsGrid = await page.waitForSelector('#listings-result')
            const listingHandles = await listingsGrid.$$('.listing_is_active')

            let listings = await Promise.all(
                listingHandles.map(async (eleHandle) => {
                    return await eleHandle.evaluate(
                        (ele, args) => {
                            return {
                                id: ele
                                    .querySelector('a')
                                    .getAttribute('href')
                                    // eslint-disable-next-line no-useless-escape
                                    .match(/\/([^\/])+\/$/g)[0]
                                    .slice(1, -1),
                                title: ele
                                    .querySelector('.car-title')
                                    .textContent.match(/\S+/g)
                                    .join(' ')
                                    .trim(),
                                category: [args.Category.FORDON],
                                date: Date.now(),
                                imageUrl: ele.querySelector('.image')
                                    ? [ele.querySelector('.image img').getAttribute('data-src')]
                                    : [],
                                isAuction: false,
                                redirectUrl: ele.querySelector('a').getAttribute('href'),
                                parameters: [],
                                price: {
                                    value: parseInt(
                                        ele
                                            .querySelector('.sale-price')
                                            .textContent.replace(' ', '')
                                    ),
                                    currency: 'kr',
                                },
                                region:
                                    ele.querySelector('.car-meta-bottom span').textContent ??
                                    undefined,
                                origin: args.ListingOrigins.Blipp,
                            }
                        },
                        { ListingOrigins, Category }
                    )
                })
            )

            listings = listings.filter((x) => !!x)

            return listings
        } catch (e) {
            return []
        }
    }

    async getListings(): Promise<Listing[]> {
        if (!this.maxPages) {
            this.maxPages = await this.numberOfPages()
        }

        if (this.currentPage > this.maxPages) {
            return []
        }

        const items = await this.getListingOnPage(this.currentPage)

        this.currentPage += 1

        return items
    }
}
