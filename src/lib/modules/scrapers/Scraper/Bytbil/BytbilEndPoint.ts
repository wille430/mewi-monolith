import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { ElementHandle } from 'puppeteer'
import { Pagination } from '../../../database/dto/pagination.dto'
import { Listing } from '../../../schemas/listing.schema'
import { ScrapeOptions } from '../../classes/types/ScrapeOptions'
import { ConfigMiddleware, EndPointDOM } from '../EndPoint'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'
import { Selectors } from '../Selectors'

export class BytbilEndPoint extends EndPointDOM<Listing> {
    protected configMiddlewares: ConfigMiddleware[] = []
    private category: string
    private baseUrl = 'https://bytbil.com/'
    private parser: ListingParser

    constructor(category: string) {
        super(category, new Selectors('.result-list', '.result-list-item'))
        this.category = category
        this.parser = new ListingParser(ListingOrigin.Bytbil, this)
    }

    protected createUrl = (pagination: Pagination, options: ScrapeOptions) => {
        const { limit = 40, skip = 0 } = pagination
        const realLimit = Math.min(options.scrapeAmount ?? 0, limit)

        const page = skip / realLimit + 1

        return `https://bytbil.com/${this.identifier}?Page=${page}`
    }

    protected async parseRawEntity(ele: ElementHandle<Element>): Promise<Partial<Listing>> {
        const listing: any = await ele.evaluate(async (ele) => {
            const href = ele.querySelector('.car-list-header > a')?.getAttribute('href')
            const priceString = ele
                .querySelector('.car-price-main')
                ?.textContent?.replace(/\D/g, '')

            return {
                origin_id: ele.querySelector('.uk-grid')?.getAttribute('data-model-id'),
                title: ele.querySelector('.car-list-header > a')?.textContent,
                // TODO
                // imageUrl: [],
                redirectUrl: href,
                isAuction: false,
                price: priceString
                    ? {
                          value: parseInt(priceString),
                      }
                    : undefined,
                category: this.category,
            }
        })

        return this.parser.parseListing({
            ...listing,
            redirectUrl: listing.redirectUrl
                ? new URL(listing.redirectUrl, this.baseUrl).toString()
                : this.baseUrl,
            price: listing.price
                ? {
                      ...listing.price,
                      currency: Currency.SEK,
                  }
                : undefined,
            category: Category.FORDON,
            date: new Date(),
        })
    }

    protected async getScrapeMetadata(): Promise<ScrapeMetadata> {
        return {
            totalPages: undefined,
        }
    }
}
