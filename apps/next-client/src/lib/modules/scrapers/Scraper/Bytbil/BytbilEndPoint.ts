import { Currency, ListingOrigin } from '@/common/schemas'
import type { Cheerio } from 'cheerio'
import { Listing } from '../../../schemas/listing.schema'
import { EndPointDOM } from '../EndPoint'
import { ScrapePagination } from '../interface/scrape-pagination.inteface'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'
import { Selectors } from '../Selectors'

export class BytbilEndPoint extends EndPointDOM<Listing> {

    private category: string
    private baseUrl = 'https://bytbil.com/'
    private parser: ListingParser

    constructor(category: string) {
        super(category, new Selectors('.result-list', '.result-list-item'))
        this.category = category
        this.parser = new ListingParser(ListingOrigin.Bytbil, this)
    }

    protected createUrl = (pagination: ScrapePagination) => {
        const { page = 1 } = pagination
        return `https://bytbil.com/${this.identifier}?Page=${page}`
    }

    protected async parseRawEntity(ele: Cheerio<any>): Promise<Partial<Listing>> {
        const href = ele.find('.car-list-header > a')?.attr('href')
        const priceString = ele.find('.car-price-main')?.text()?.replace(/\D/g, '')

        return this.parser.parseListing({
            origin_id: ele.find('.uk-grid')?.attr('data-model-id'),
            title: ele.find('.car-list-header > a')?.text(),
            // TODO
            // imageUrl: [],
            isAuction: false,
            redirectUrl: href ? new URL(href, this.baseUrl).toString() : this.baseUrl,
            price: priceString
                ? {
                      value: parseInt(priceString),
                      currency: Currency.SEK,
                  }
                : undefined,
            date: new Date(),
            category: await this.parser.parseCategory(this.category),
        })
    }

    protected async getScrapeMetadata(): Promise<ScrapeMetadata> {
        return {
            totalPages: undefined,
        }
    }
}
