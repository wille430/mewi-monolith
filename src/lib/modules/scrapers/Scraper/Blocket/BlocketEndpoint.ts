import { Currency, ListingOrigin } from '@/common/schemas'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Pagination } from '../../../database/dto/pagination.dto'
import { Listing } from '../../../schemas/listing.schema'
import { ScrapeOptions } from '../../classes/types/ScrapeOptions'
import { BlocketListing } from '../../types/blocketListing'
import { ConfigMiddleware, NextEndPoint } from '../EndPoint'
import { ScrapeMetadata } from '../Scraper'
import { ListingParser } from '../ListingParser'

export class BlocketEndpoint extends NextEndPoint<Listing> {
    protected configMiddlewares: (<T>(
        config: AxiosRequestConfig<T>
    ) => Promise<AxiosRequestConfig<T>>)[]
    private parser: ListingParser

    constructor() {
        super('https://www.blocket.se/', BlocketEndpoint.name)

        this.configMiddlewares = [this.addBearer.bind(this)]
        this.parser = new ListingParser(this.identifier as ListingOrigin, this)
    }

    protected extractEntities(res: AxiosResponse<any, any>): any[] | Promise<any[]> {
        return res.data.data
    }

    protected async getScrapeMetadata(res: AxiosResponse<any, any>): Promise<ScrapeMetadata> {
        return {
            totalPages: res.data.total_page_count,
        }
    }

    protected async parseRawEntity(obj: any): Promise<Partial<Listing>> {
        return this.parser.parseListing({
            origin_id: this.parser.createId(obj.ad_id),
            title: obj.subject,
            body: obj.body,
            category: await this.parser.parseCategory(obj.category[0].name),
            date: new Date(obj.list_time),
            imageUrl: obj.images
                ? obj.images.map(
                      (img: { url: string }) => img.url + '?type=mob_iphone_vi_normal_retina'
                  )
                : [],
            redirectUrl: obj.share_url,
            isAuction: false,
            price: obj.price
                ? {
                      value: parseFloat(obj.price.value),
                      currency: Currency.SEK,
                  }
                : undefined,
            region: this.parseRegion(obj.location),
            parameters: this.parseParameters(obj.parameter_groups),
        })
    }

    protected createAxiosConfig(
        pagination: Pagination,
        options: ScrapeOptions
    ): Promise<AxiosRequestConfig<any>> {
        let page = pagination.page ? pagination.page - 1 : null

        const { limit = 40, skip = 0 } = pagination
        const realLimit = Math.min(options.scrapeAmount ?? 0, limit)

        page ??= skip / realLimit

        return Promise.resolve({
            url: `https://api.blocket.se/search_bff/v2/content?lim=${realLimit}&page=${page}&st=s&status=active&include=placements&gl=3&include=extend_with_shipping`,
        })
    }

    private addBearer: ConfigMiddleware = async (config) => {
        const nextData = await this.getNextData()
        const bearer = nextData.props.initialReduxState.authentication.bearerToken

        return {
            ...config,
            headers: {
                Authorization: `Bearer ${bearer}`,
            },
        }
    }

    parseRegion(location: BlocketListing['location']) {
        const regionLocation = location.find((x) => x.query_key === 'r')

        if (!regionLocation) {
            return location[0].name
        } else {
            return regionLocation.name
        }
    }

    parseParameters(parameterGroups: BlocketListing['parameter_groups']) {
        const parameters: Listing['parameters'] = []

        if (parameterGroups) {
            for (const parameterGroup of parameterGroups) {
                if (parameterGroup) {
                    for (const parameter of parameterGroup.parameters) {
                        parameters.push({
                            label: parameter.label,
                            value: parameter.value,
                        })
                    }
                }
            }
        }

        return parameters
    }
}
