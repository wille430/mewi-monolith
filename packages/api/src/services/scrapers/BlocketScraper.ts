import Scraper from './Scraper'
import { toUnixTime } from '@mewi/util'
import CategoryService from '../CategoryService'
import { BlocketItemData, ItemData } from 'types/types'

import { JSDOM } from 'jsdom'
import axios from 'axios'

export default class BlocketScraper extends Scraper {
    baseUrl = 'https://www.blocket.se'
    page = 1

    constructor(maxEntries?: number) {
        super({
            maxEntries,
            name: 'blocket',
            limit: 40,
        })
    }

    async getNextArticles(): Promise<ItemData[]> {
        try {
            const url = `https://api.blocket.se/search_bff/v1/content?lim=${this.limit}&page=${this.page}&st=s&include=all&gl=3&include=extend_with_shipping`

            const authToken: string = await this.getBearerToken()
            if (!authToken) throw Error('Missing authentication token')

            const dom = await axios.get(url, {
                baseURL: this.baseUrl,
                headers: {
                    authorization: 'Bearer ' + authToken,
                },
            })

            const data = dom.data.data

            // let items: ItemData[] = await Promise.all(data.map(async (item: BlocketItemData) => {
            //     return await this.getFullDataFrom(item.ad_id)
            // }))

            const items: ItemData[] = data.map(
                (item: BlocketItemData): ItemData => ({
                    id: item.ad_id,
                    title: item.subject,
                    body: item.body,
                    category: CategoryService.parseBlocketCategories(item.category),
                    date: toUnixTime(new Date(item.list_time)),
                    imageUrl: item.images
                        ? item.images.map((img) => img.url + '?type=mob_iphone_vi_normal_retina')
                        : [],
                    redirectUrl: item.share_url,
                    isAuction: false,
                    price: item.price
                        ? {
                              value: item.price.value,
                              currency: item.price.suffix,
                          }
                        : {},
                    region: item.location[0].name,
                    zipcode: item.zipcode,
                    parameters: this.parseParameterGroup(item.parameter_groups),
                    origin: 'Blocket',
                })
            )

            this.page += 1
            return items
        } catch (e) {
            console.log(e)
        }
    }

    async getFullDataFrom(itemId): Promise<ItemData> {
        const authToken = await this.getBearerToken()
        const url = `https://api.blocket.se/search_bff/v1/content/${itemId}?include=safety_tips&include=store&include=partner_placements&include=breadcrumbs&include=archived&include=car_condition&status=active&status=deleted&status=hidden_by_user`

        const dom = await axios.get(url, {
            baseURL: this.baseUrl,
            headers: {
                authorization: 'Bearer ' + authToken,
            },
        })

        const itemData = dom.data.data

        // Get item parameters/detailed info
        let params = null
        if (itemData.parameter_groups) {
            const paramGroup = itemData.parameter_groups.find(
                (x) => x.label === 'Allmän information'
            )
            if (paramGroup && paramGroup.parameters) {
                params = paramGroup.parameters
            }
        }

        const item: ItemData = {
            id: itemData.ad_id,
            title: itemData.subject,
            body: itemData.body,
            category: itemData.category.map((cat) => cat.name) || [],
            date: toUnixTime(new Date(itemData.list_time)),
            imageUrl: itemData.images
                ? itemData.images.map((img) => img.url + '?type=mob_iphone_vi_normal_retina')
                : [],
            redirectUrl: itemData.share_url,
            price: itemData.price
                ? {
                      value: itemData.price.value,
                      currency: itemData.price.suffix,
                  }
                : {},
            isAuction: false,
            region: itemData.location[0].name,
            zipcode: itemData.zipcode,
            parameters: params,
            origin: 'Blocket',
        }

        return item
    }

    async getBearerToken(): Promise<string> {
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
                const token = JSON.parse(bearerNode.textContent).props.initialReduxState
                    .authentication.bearerToken

                return token
            } catch (e) {
                if (tries === maxTries) throw e
                tries += 1
            }
        }
    }

    parseParameterGroup(
        parameter_groups: BlocketItemData['parameter_groups']
    ): ItemData['parameters'] {
        let params = null
        if (parameter_groups) {
            const paramGroup = parameter_groups.find((x) => x.label === 'Allmän information')
            if (paramGroup && paramGroup.parameters) {
                params = paramGroup.parameters
            }
        }
        return params
    }
}
