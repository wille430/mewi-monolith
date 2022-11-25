import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Pagination } from '@/lib/modules/database/dto/pagination.dto'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import { safeToDate } from '@/lib/utils/dateUtils'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiEndPoint, ConfigMiddleware } from '../EndPoint'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'

export class CitiboardEndPoint extends ApiEndPoint<Listing> {
    protected configMiddlewares: ConfigMiddleware[] = []
    private parser: ListingParser

    constructor() {
        super(CitiboardEndPoint.name)
        this.parser = new ListingParser(ListingOrigin.Citiboard, this)
    }

    protected createAxiosConfig({ page = 1 }: Pagination): Promise<AxiosRequestConfig<any>> {
        return Promise.resolve({
            url: `https://api42.citiboard.se/cb/annonslista?url=/&sida=${page}&sort=&sok=`,
        })
    }

    protected extractEntities(res: AxiosResponse<any, any>): any[] | Promise<any[]> {
        return res.data.annonser
    }

    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        return this.parser.parseListing({
            title: obj.rubrik,
            category: Category.OVRIGT,
            date: safeToDate(obj.skapad) ?? new Date(),
            imageUrl: obj.thumb
                ? [`https://citiboard-media.s3.eu-north-1.amazonaws.com/a/medium/${obj.thumb}`]
                : [],
            isAuction: false,
            origin_id: this.parser.createId(obj.annons_id),
            redirectUrl: 'https://citiboard.se/annons/' + obj.permalink,
            price: obj.pris
                ? {
                      value: parseInt(obj.pris),
                      currency: Currency.SEK,
                  }
                : undefined,
        })
    }
    protected getScrapeMetadata(): Promise<ScrapeMetadata> {
        return Promise.resolve({})
    }
}
