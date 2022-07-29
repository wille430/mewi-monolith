import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { JSDOM } from 'jsdom'
import { Inject } from '@nestjs/common'
import { Currency, ListingOrigin, Listing, Prisma } from '@mewi/prisma'
import { BlocketListing } from '../types/blocketListing'
import { ListingScraper } from '../classes/ListingScraper'
import { PrismaService } from '@/prisma/prisma.service'

export class BlocketScraper extends ListingScraper {
    baseUrl = 'https://www.blocket.se/'
    origin: ListingOrigin = ListingOrigin.Blocket

    limit = 50
    readonly defaultScrapeUrl = `https://api.blocket.se/search_bff/v1/content?lim=${
        this.limit
    }&page=${0}&st=s&include=all&gl=3&include=extend_with_shipping`

    constructor(@Inject(PrismaService) readonly prisma: PrismaService) {
        super(prisma)

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
                const { data } = await axios.get(this.baseUrl)

                const dom = new JSDOM(data)
                const { document } = dom.window
                const bearerNode = document.querySelector(
                    'script#__NEXT_DATA__[type="application/json"]'
                )

                const textContent = bearerNode?.textContent

                if (!textContent) {
                    throw new Error('Could not find bearer token in DOM')
                } else {
                    const token =
                        JSON.parse(textContent).props.initialReduxState.authentication.bearerToken
                    return token
                }
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

    parseRawListing(item: Record<string, any>): Prisma.ListingCreateInput {
        return {
            origin_id: this.createId(item.ad_id),
            title: item.subject,
            body: item.body,
            category: this.parseCategory(item.category[0].name),
            date: new Date(item.list_time),
            imageUrl: item.images
                ? item.images.map((img) => img.url + '?type=mob_iphone_vi_normal_retina')
                : [],
            redirectUrl: item.share_url,
            isAuction: false,
            price: item.price
                ? {
                      value: parseFloat(item.price.value),
                      currency: Currency.SEK,
                  }
                : null,
            region: this.parseRegion(item.location),
            parameters: this.parseParameters(item.parameter_groups),
            origin: ListingOrigin.Blocket,
        }
    }
}
