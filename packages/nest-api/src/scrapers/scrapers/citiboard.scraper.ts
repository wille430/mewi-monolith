import { Inject } from '@nestjs/common'
import { ElementHandle } from 'puppeteer'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import { ScrapeContext } from '../classes/types/ScrapeContext'
import { ScrapedListing } from '../classes/types/ScrapedListing'
import { ConfigService } from '@nestjs/config'
import { ListingsRepository } from '@/listings/listings.repository'
import { Category, Currency, ListingOrigin } from '@wille430/common'

// TODO: find maximum offset
export class CitiboardScraper extends ListingWebCrawler {
    readonly defaultScrapeUrl = 'https://citiboard.se/hela-sverige'
    limit = 60

    baseUrl = 'https://citiboard.se/'
    origin: ListingOrigin = ListingOrigin.Citiboard

    constructor(
        @Inject(ListingsRepository) listingsRepository: ListingsRepository,
        @Inject(ConfigService) config: ConfigService
    ) {
        super(listingsRepository, config, { listingSelector: 'article.gridItem' })

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))

        this.defaultStartOptions.watchOptions = {
            ...this.defaultStartOptions.watchOptions,
            findFirst: 'origin_id',
        }
    }

    createScrapeUrl = (page: number) => this.defaultScrapeUrl + `?offset=${(page - 1) * this.limit}`

    async evalParseRawListing(ele: ElementHandle<Element>, context: ScrapeContext) {
        const listing: any = await ele.evaluate(async (ele) => {
            const imageUrl = ele.querySelector('.picture img')?.getAttribute('src')
            const priceString = ele.querySelector('.gridPrice')?.textContent

            return {
                origin_id: ele.getAttribute('id'),
                title: ele.querySelector('meta')?.content,
                imageUrl: imageUrl ? [imageUrl] : undefined,
                redirectUrl: ele.querySelector('.gridTitle a')?.getAttribute('href'),
                isAuction: false,
                price: priceString
                    ? {
                          value: parseFloat(priceString),
                      }
                    : undefined,
                region: ele.querySelector('.gridLocation span')?.textContent,
            }
        })

        return {
            ...listing,
            origin_id: this.createId(listing.origin_id),
            redirectUrl: new URL(listing.redirectUrl, this.baseUrl).toString(),
            price: listing.price
                ? {
                      value: listing.price.value,
                      currency: Currency.SEK,
                  }
                : undefined,
            // TODO: assign correct category
            category: Category.OVRIGT,
            origin: this.origin,
            date: new Date(),
            entryPoint: context.entryPoint.identifier,
        } as ScrapedListing
    }
}
