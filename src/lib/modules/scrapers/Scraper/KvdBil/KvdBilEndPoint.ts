import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Pagination } from '@/lib/modules/database/dto/pagination.dto'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiEndPoint, ConfigMiddleware } from '../EndPoint'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'

export class KvdBilEndPoint extends ApiEndPoint<Listing> {
    protected configMiddlewares: ConfigMiddleware[] = []
    private limit = 20
    private parser: ListingParser = new ListingParser(ListingOrigin.Kvdbil, this)

    constructor() {
        super(KvdBilEndPoint.name)
    }

    protected createAxiosConfig({ page = 1 }: Pagination): Promise<AxiosRequestConfig<any>> {
        const offset = (page - 1) * this.limit

        return Promise.resolve({
            url: `https://api.kvd.se/v1/auction/search?orderBy=-grade&auctionType=BUY_NOW&limit=${this.limit}&offset=${offset}`,
        })
    }

    protected extractEntities(res: AxiosResponse<any, any>): any[] | Promise<any[]> {
        return res.data.auctions
    }

    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        return this.parser.parseListing({
            origin_id: this.parser.createId(obj.id),
            title: obj?.processObject?.title,
            category: Category.FORDON,
            date: new Date(obj.openedAt ?? new Date()),
            imageUrl: obj.previewImages.map((o: any) => o.uri),
            redirectUrl: obj.auctionUrl,
            isAuction: obj.processObject.state === 'AUCTION',
            price: obj.buyNowAmount
                ? {
                      value: obj.buyNowAmount,
                      currency: Currency.SEK,
                  }
                : undefined,
        })
    }

    protected getScrapeMetadata(res: AxiosResponse<any, any>): Promise<ScrapeMetadata> {
        return Promise.resolve({
            totalPages: Math.ceil(res.data.hits / this.limit),
        })
    }
}
