import type {AxiosResponse} from 'axios'
import {ListingParser} from '../ListingParser'
import {ScrapeMetadata} from '../Scraper'
import {AbstractEndPoint} from "../EndPoint"
import {Category, Currency, ListingOrigin} from "@mewi/models"
import {Listing} from "@mewi/entities"
import {SellpyListing} from "./SellpyListing.interface"
import axios from "axios"

export class SellpyEndPoint extends AbstractEndPoint<Listing, AxiosResponse, SellpyListing> {
    private limit = 50
    private parser: ListingParser = new ListingParser(ListingOrigin.Sellpy, this)

    constructor() {
        super(SellpyEndPoint.name)
    }

    protected getResponse(page: number): Promise<AxiosResponse> {
        return axios({
            method: 'POST',
            url: `https://m6wnfr0lvi-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.0)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.2.2)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.7.0)&x-algolia-api-key=313e09c3b00b6e2da5dbe382cd1c8f4b&x-algolia-application-id=M6WNFR0LVI`,
            data: {
                requests: [
                    {
                        indexName: 'prod_marketItem_en_relevance',
                        params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=${
                            this.limit
                        }&filters=NOT%20private%20%3D%201%20AND%20price_EU.amount%20%3E%200&clickAnalytics=true&maxValuesPerFacet=10000&query=&page=${
                            page - 1
                        }&facets=%5B%22promo%22%2C%22user%22%2C%22campaign%22%2C%22objectID%22%2C%22featuredIn%22%2C%22lastChance%22%2C%22metadata.demography%22%2C%22sizes%22%2C%22metadata.brand%22%2C%22metadata.type%22%2C%22metadata.condition%22%2C%22pricing.amount%22%2C%22metadata.color%22%2C%22metadata.material%22%2C%22metadata.pattern%22%2C%22metadata.sleeveLength%22%2C%22metadata.neckline%22%2C%22metadata.restrictedModel%22%2C%22categories.lvl0%22%5D&tagFilters=`,
                    },
                ],
            },
        })
    }

    protected extractEntities(res: AxiosResponse): SellpyListing[] | Promise<SellpyListing[]> {
        return res.data.results[0].hits
    }


    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        return this.parser.parseListing({
            origin_id: this.parser.createId(obj.objectID),
            title: obj.metadata.brand ?? obj.metadata.type,
            category: Category.PERSONLIGT,
            date: obj.createdAt ? new Date(obj.createdAt * 1000) : new Date(),
            imageUrl: obj.images ?? [],
            isAuction: false,
            parameters: [],
            redirectUrl: `https://sellpy.com/item/${obj.objectID}`,
            price: obj.pricing?.amount
                ? {
                    value: obj.pricing.amount,
                    currency: Currency.SEK,
                }
                : undefined,
        })
    }

    protected getScrapeMetadata(res: AxiosResponse): Promise<ScrapeMetadata> {
        return Promise.resolve({
            totalPages: res.data.results[0].nbPages,
        })
    }
}
