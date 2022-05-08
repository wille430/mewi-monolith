import { Scraper } from './scraper'
import { SellpyItemData } from '@/types/types'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Category, Currency, Listing, ListingOrigin } from '@prisma/client'

export class SellpyScraper extends Scraper {
    page = 1
    limit = 50

    constructor(@Inject(PrismaService) prisma: PrismaService, configService: ConfigService) {
        super(prisma, configService, ListingOrigin.Sellpy, 'https://www.sellpy.se/', {})
    }

    async getListings(): Promise<Listing[]> {
        try {
            const url = `https://m6wnfr0lvi-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.8.0)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.2.2)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.7.0)&x-algolia-api-key=313e09c3b00b6e2da5dbe382cd1c8f4b&x-algolia-application-id=M6WNFR0LVI`

            const dom = await axios.post(url, {
                requests: [
                    {
                        indexName: 'prod_marketItem_en_relevance',
                        params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=${
                            this.limit
                        }&filters=NOT%20private%20%3D%201%20AND%20price_EU.amount%20%3E%200&clickAnalytics=true&maxValuesPerFacet=10000&query=&page=${
                            this.page - 1
                        }&facets=%5B%22promo%22%2C%22user%22%2C%22campaign%22%2C%22objectID%22%2C%22featuredIn%22%2C%22lastChance%22%2C%22metadata.demography%22%2C%22sizes%22%2C%22metadata.brand%22%2C%22metadata.type%22%2C%22metadata.condition%22%2C%22pricing.amount%22%2C%22metadata.color%22%2C%22metadata.material%22%2C%22metadata.pattern%22%2C%22metadata.sleeveLength%22%2C%22metadata.neckline%22%2C%22metadata.restrictedModel%22%2C%22categories.lvl0%22%5D&tagFilters=`,
                    },
                ],
            })

            const data = dom.data.results[0].hits

            const listings: Listing[] = data.map(
                (item: SellpyItemData): Listing => ({
                    id: item.objectID,
                    title: item.metadata.brand ?? item.metadata.type,
                    category: Category.PERSONLIGT,
                    date: item.createdAt ? new Date(item.createdAt * 1000) : new Date(),
                    imageUrl: item.images ?? [],
                    isAuction: false,
                    body: null,
                    parameters: [],
                    region: null,
                    redirectUrl: `https://sellpy.com/item/${item.objectID}`,
                    price: item.pricing
                        ? {
                              value: item.pricing.amount || 0,
                              currency: Currency.SEK,
                          }
                        : null,
                    origin: ListingOrigin.Sellpy,
                    auctionEnd: null,
                })
            )

            this.page += 1

            return listings
        } catch (e) {
            console.log(e.stack)
            return []
        }
    }
}
