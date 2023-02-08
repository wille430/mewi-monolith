import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { NextEndPointWithBuildId } from '../EndPoint'
import { ScrapePagination } from '../interface/scrape-pagination.inteface'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'

export class BlippEndPoint extends NextEndPointWithBuildId<Listing> {
    private limit = 40
    private parser: ListingParser

    constructor() {
        super('https://blipp.se/', BlippEndPoint.name)
        this.parser = new ListingParser(ListingOrigin.Blipp, this)
    }

    protected createAxiosConfig(pagination: ScrapePagination): Promise<AxiosRequestConfig<any>> {
        const { page = 1 } = pagination

        return Promise.resolve({
            url: 'https://blipp.se/api/proxy',
            data: {
                method: 'getMarketplaceAds',
                payload: {
                    params: `filters%5Btag%5D=&sort%5Bcolumn%5D=published_date&sort%5Border%5D=desc&page=${page}&per_page=${this.limit}`,
                },
            },
        })
    }
    protected extractEntities(res: AxiosResponse<any, any>): any[] | Promise<any[]> {
        return res.data.body.payload.items
    }

    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        const { vehicle, published_date, cover_photo, entity_id, municipality } = obj

        return this.parser.parseListing({
            origin_id: this.parser.createId(
                `${(vehicle.brand as string).toLowerCase().slice(0, 16)}_${vehicle.entity_id}`
            ),
            title: vehicle.car_name,
            category: Category.FORDON,
            date: new Date(published_date),
            imageUrl: cover_photo ? [cover_photo.full_path] : [],
            redirectUrl: `https://blipp.se/fordon/${entity_id}`,
            isAuction: false,
            price: vehicle.monthly_cost?.car_info_valuation
                ? {
                      value: parseFloat(
                          (vehicle.monthly_cost.car_info_valuation as string).replace(' ', '')
                      ),
                      currency: Currency.SEK,
                  }
                : undefined,
            region: municipality?.name,
        })
    }
    protected async getScrapeMetadata(res: AxiosResponse<any, any>): Promise<ScrapeMetadata> {
        const payload = res.data.body.payload
        this.limit = payload.per_page

        return {
            totalPages: payload.pages,
        }
    }
}
