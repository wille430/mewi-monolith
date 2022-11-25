import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { ElementHandle } from 'puppeteer-core'
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

    protected async parseRawEntity(ele: ElementHandle<Element>): Promise<Partial<Listing>> {
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

        return this.parser.parseListing({
            ...listing,
            origin_id: this.parser.createId(listing.origin_id),
            redirectUrl: new URL(listing.redirectUrl, this.baseUrl).toString(),
            price: listing.price
                ? {
                      value: listing.price.value,
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
