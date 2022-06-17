import axios from 'axios'
import { JSDOM } from 'jsdom'
// import { stringSimilarity } from "@mewi/prisma";
import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { Currency, ListingOrigin, Listing, Prisma } from '@mewi/prisma'
import { BlocketListing } from '../types/blocketListing'
import { Scraper } from '../scraper'
import { ScraperType } from '../scraper-type.enum'
import { PrismaService } from '@/prisma/prisma.service'

export class BlocketScraper extends Scraper {
    page = 0
    limit = 50

    constructor(@Inject(PrismaService) prisma: PrismaService, configService: ConfigService) {
        super(prisma, configService, ListingOrigin.Blocket, 'https://www.blocket.se/', {
            scraperType: ScraperType.API_FETCH,
        })
    }

    async getBearerToken(): Promise<string | null> {
        let tries = 0
        const maxTries = 3
        while (tries < maxTries) {
            try {
                const { data } = await axios.get(this.scrapeUrl)

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

    async getListings(): Promise<Prisma.ListingCreateInput[]> {
        try {
            const url = `https://api.blocket.se/search_bff/v1/content?lim=${this.limit}&page=${this.page}&st=s&include=all&gl=3&include=extend_with_shipping`

            const authToken = await this.getBearerToken()
            if (!authToken) throw Error('Missing authentication token')

            const dom = await axios.get(url, {
                baseURL: this.scrapeUrl,
                headers: {
                    authorization: 'Bearer ' + authToken,
                },
            })

            const data = dom.data.data

            const items: Prisma.ListingCreateInput[] = data.map(this.parseRawListing)

            this.page += 1
            return items
        } catch (e) {
            console.log(e)
            return []
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
            auctionEnd: null,
        }
    }

    reset(): void {
        super.reset()
        this.page = 0
    }
}
