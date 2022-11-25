import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Pagination } from '@/lib/modules/database/dto/pagination.dto'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiEndPoint, ConfigMiddleware } from '../EndPoint'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'

export class SellpyEndPoint extends ApiEndPoint<Listing> {
    protected configMiddlewares: ConfigMiddleware[] = []
    private limit = 50
    private parser: ListingParser = new ListingParser(ListingOrigin.Sellpy, this)

    constructor() {
        super(SellpyEndPoint.name)
    }

    protected createAxiosConfig({ page = 1 }: Pagination): Promise<AxiosRequestConfig<any>> {
        return Promise.resolve({
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

    protected extractEntities(res: AxiosResponse<any, any>): any[] | Promise<any[]> {
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

    protected getScrapeMetadata(res: AxiosResponse<any, any>): Promise<ScrapeMetadata> {
        return Promise.resolve({
            totalPages: res.data.results[0].nbPages,
        })
    }
}
