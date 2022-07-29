import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Inject } from '@nestjs/common'
import { Category, Currency, ListingOrigin, Prisma } from '@mewi/prisma'
import { PrismaService } from '@/prisma/prisma.service'
import { GetBatchOptions, ListingScraper } from '../classes/ListingScraper'
import { EntryPoint } from '../classes/EntryPoint'

// TODO: fix pagination
export class SellpyScraper extends ListingScraper {
    limit = 50
    readonly defaultScrapeUrl = `https://m6wnfr0lvi-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.0)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.2.2)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.7.0)&x-algolia-api-key=313e09c3b00b6e2da5dbe382cd1c8f4b&x-algolia-application-id=M6WNFR0LVI`

    entryPoints: EntryPoint[]
    baseUrl: string = 'https://www.sellpy.se/'
    origin: ListingOrigin = ListingOrigin.Sellpy

    defaultAxiosRequestConfig: AxiosRequestConfig<any> = {
        method: 'POST',
    }

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma)
        this.parseRawListing = this.parseRawListing.bind(this)

        this.createEntryPoint(
            () => ({
                url: this.defaultScrapeUrl,
                data: {
                    requests: [
                        {
                            indexName: 'prod_marketItem_en_relevance',
                            params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=${
                                this.limit
                            }&filters=NOT%20private%20%3D%201%20AND%20price_EU.amount%20%3E%200&clickAnalytics=true&maxValuesPerFacet=10000&query=&page=${0}&facets=%5B%22promo%22%2C%22user%22%2C%22campaign%22%2C%22objectID%22%2C%22featuredIn%22%2C%22lastChance%22%2C%22metadata.demography%22%2C%22sizes%22%2C%22metadata.brand%22%2C%22metadata.type%22%2C%22metadata.condition%22%2C%22pricing.amount%22%2C%22metadata.color%22%2C%22metadata.material%22%2C%22metadata.pattern%22%2C%22metadata.sleeveLength%22%2C%22metadata.neckline%22%2C%22metadata.restrictedModel%22%2C%22categories.lvl0%22%5D&tagFilters=`,
                        },
                    ],
                },
            }),
            (res) => res.data.results[0].nbPages
        )
    }

    createScrapeUrl = (...args: any) => {
        return this.defaultScrapeUrl
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.results[0].hits
    }

    override parseRawListing(item: Record<string, any>): Prisma.ListingCreateInput {
        return {
            origin_id: this.createId(item.objectID),
            title: item.metadata.brand ?? item.metadata.type,
            category: Category.PERSONLIGT,
            date: item.createdAt ? new Date(item.createdAt * 1000) : new Date(),
            imageUrl: item.images ?? [],
            isAuction: false,
            body: null,
            parameters: [],
            region: null,
            redirectUrl: `https://sellpy.com/item/${item.objectID}`,
            price: item.pricing?.amount
                ? {
                      value: item.pricing.amount,
                      currency: Currency.SEK,
                  }
                : null,
            origin: ListingOrigin.Sellpy,
            auctionEnd: null,
        }
    }
}
