import type { AxiosInstance, AxiosResponse } from 'axios'
import { ListingOrigin, Currency } from '@wille430/common'
import { inject } from 'tsyringe'
import type { BlocketListing } from '../types/blocketListing'
import { ListingScraper } from '../classes/ListingScraper'
import type { ScrapeContext } from '../classes/types/ScrapeContext'
import { getNextData } from '../helpers/getNextData'
import type { ScrapedListing } from '../classes/types/ScrapedListing'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import { ListingsRepository } from '../../listings/listings.repository'
import type { Listing } from '../../schemas/listing.schema'

export class BlocketScraper extends ListingScraper {
    baseUrl = 'https://www.blocket.se/'
    origin: ListingOrigin = ListingOrigin.Blocket

    limit = 50
    readonly defaultScrapeUrl = `https://api.blocket.se/search_bff/v1/content?lim=${
        this.limit
    }&page=${0}&st=s&include=all&gl=3&include=extend_with_shipping`

    constructor(
        @inject(ListingsRepository) listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) scrapingLogsRepository: ScrapingLogsRepository
    ) {
        super(listingsRepository, scrapingLogsRepository)

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))
    }

    override createScrapeUrl = (page = 0): string =>
        `https://api.blocket.se/search_bff/v1/content?lim=${this.limit}&page=${page}&st=s&include=all&gl=3&include=extend_with_shipping`

    getTotalPages(res: AxiosResponse) {
        return res.data.total_page_count
    }

    async getBearerToken(): Promise<string | null> {
        let tries = 0
        const maxTries = 3
        while (tries < maxTries) {
            try {
                const nextData = await getNextData(this.baseUrl)
                const token = nextData.props.initialReduxState.authentication.bearerToken
                return token
            } catch (e) {
                if (tries === maxTries) throw e
                tries += 1
            }
        }

        return null
    }

    async createAxiosInstance(): Promise<AxiosInstance> {
        const instance = await super.createAxiosInstance()
        instance.defaults.headers.common['Authorization'] = `Bearer ${await this.getBearerToken()}`
        return instance
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.data
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

    async parseRawListing(
        item: Record<string, any>,
        context: ScrapeContext
    ): Promise<ScrapedListing> {
        return {
            origin_id: this.createId(item.ad_id),
            title: item.subject,
            body: item.body,
            category: await this.parseCategory(item.category[0].name),
            date: new Date(item.list_time),
            imageUrl: item.images
                ? item.images.map(
                      (img: { url: string }) => img.url + '?type=mob_iphone_vi_normal_retina'
                  )
                : [],
            redirectUrl: item.share_url,
            isAuction: false,
            price: item.price
                ? {
                      value: parseFloat(item.price.value),
                      currency: Currency.SEK,
                  }
                : undefined,
            region: this.parseRegion(item.location),
            parameters: this.parseParameters(item.parameter_groups),
            origin: ListingOrigin.Blocket,
            entryPoint: context.entryPoint.identifier,
        }
    }
}
