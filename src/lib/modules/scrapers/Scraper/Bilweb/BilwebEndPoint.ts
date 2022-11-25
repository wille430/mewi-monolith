import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import type { Cheerio } from 'cheerio'
import { EndPointDOM } from '../EndPoint'
import { ScrapePagination } from '../interface/scrape-pagination.inteface'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'
import { Selectors } from '../Selectors'

export class BilwebEndPoint extends EndPointDOM<Listing> {
    private parser: ListingParser
    private baseUrl = 'https://bilweb.se/'
    private limit = 30

    constructor() {
        super(BilwebEndPoint.name, new Selectors('.Card-Wrapper', '.Card'))
        this.parser = new ListingParser(ListingOrigin.Bilweb, this)
    }

    protected createUrl({ page = 1 }: ScrapePagination): string {
        const offset = (page - 1) * this.limit
        return new URL(
            `/sok?query=&type=1&limit=${this.limit}&offset=${offset}`,
            this.baseUrl
        ).toString()
    }

    protected async parseRawEntity(ele: Cheerio<any>): Promise<Partial<Listing>> {
        const imageUrl = ele.find('img.goToObject')?.attr('src')
        const priceString = ele.find('.Card-mainPrice')?.text()
        const redirectPath = ele.find('.Card-heading a')?.attr('href')

        return this.parser.parseListing({
            title: ele.find('.Card-heading')?.text(),
            imageUrl: imageUrl ? [imageUrl] : undefined,
            isAuction: false,
            origin_id: this.parser.createId(ele.attr('id') as any),
            redirectUrl: redirectPath
                ? new URL(redirectPath, this.baseUrl).toString()
                : this.baseUrl,
            price: priceString
                ? {
                      value: parseFloat(priceString),
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
