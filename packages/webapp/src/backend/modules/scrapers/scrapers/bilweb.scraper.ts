import { Category, Currency, ListingOrigin } from '@wille430/common'
import type { ElementHandle } from 'puppeteer'
import { autoInjectable, inject } from 'tsyringe'
import { ListingsRepository } from '../../listings/listings.repository'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import type { ScrapeContext } from '../classes/types/ScrapeContext'
import type { ScrapedListing } from '../classes/types/ScrapedListing'
import { ScrapingLogsRepository } from '../scraping-logs.repository'

@autoInjectable()
export class BilwebScraper extends ListingWebCrawler {
    defaultScrapeUrl = 'https://bilweb.se/sok'
    limit = 30
    baseUrl = 'https://bilweb.se/'
    origin = ListingOrigin.Bilweb

    constructor(
        @inject(ListingsRepository) listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) scrapingLogsRepository: ScrapingLogsRepository
    ) {
        super(listingsRepository, scrapingLogsRepository, {
            listingSelector: '.Card-Wrapper > .Card',
        })

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))

        this.defaultStartOptions.watchOptions = {
            ...this.defaultStartOptions.watchOptions,
            findFirst: 'origin_id',
        }
    }

    createScrapeUrl = (page: number) => {
        const offset = (page - 1) * this.limit
        return this.defaultScrapeUrl + `?limit=${this.limit}&offset=${offset}`
    }

    async evalParseRawListing(
        ele: ElementHandle<Element>,
        context: ScrapeContext
    ): Promise<ScrapedListing> {
        const listing: any = await ele.evaluate(async (ele) => {
            const imageUrl = ele.querySelector('img.goToObject')?.getAttribute('src')
            const priceString = ele.querySelector('.Card-mainPrice')?.textContent

            return {
                origin_id: ele.getAttribute('id'),
                title: ele.querySelector('.Card-heading')?.textContent,
                imageUrl: imageUrl ? [imageUrl] : undefined,
                redirectUrl: ele.querySelector('.Card-heading a')?.getAttribute('href'),
                isAuction: false,
                price: priceString
                    ? {
                          value: parseFloat(priceString),
                      }
                    : undefined,
            }
        })

        return {
            ...listing,
            origin_id: this.createId(listing.origin_id),
            redirectUrl: this.baseUrl.toString(),
            price: listing.price
                ? {
                      value: listing.price.value,
                      currency: Currency.SEK,
                  }
                : undefined,
            category: Category.FORDON,
            origin: this.origin,
            date: new Date(),
            entryPoint: context.entryPoint.identifier,
        } as ScrapedListing
    }
}
