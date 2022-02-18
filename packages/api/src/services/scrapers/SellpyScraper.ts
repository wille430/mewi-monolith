import { Category, SellpyItemData } from 'types/types'
import { ItemData } from '@mewi/types'
import Scraper from './Scraper'
import axios from 'axios'

export default class SellpyScraper extends Scraper {
    page = 1

    constructor(maxEntries?) {
        super({
            maxEntries,
            name: 'sellpy',
            limit: 20,
            baseUrl: 'https://www.sellpy.com/',
        })
    }

    async getNextArticles(): Promise<ItemData[]> {
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

            const items: ItemData[] = data.map(
                (item: SellpyItemData): ItemData => ({
                    id: item.objectID,
                    title: item.metadata.brand || item.metadata.type,
                    category: [],
                    date: item.updatedAt * 1000,
                    imageUrl: item.images || [],
                    isAuction: false,
                    redirectUrl: item.metadata.brand
                        ? `https://sellpy.com/item/${item.objectID}`
                        : null,
                    price: item.pricing
                        ? {
                              value: item.pricing.amount || 0,
                              currency: item.pricing.currency,
                          }
                        : undefined,
                    region: null,
                    origin: 'Sellpy',
                })
            )

            this.page += 1

            return items
        } catch (e) {
            console.log(e.stack)
        }
    }

    parseCategories(categoriesObj: Record<string, unknown>): Category {
        const catsArray: Category | any = {}

        Object.values(categoriesObj).forEach((cat) => {
            cat = cat[0]
            switch (cat) {
                case 'Men':
                case 'Women':
                    catsArray.push('personligt')
                    catsArray.push('kläder_skor')
                    break
                case 'Kids':
                    catsArray.push('barnkläder_skor')
                    break
                case 'Accessories':
                    catsArray.push('accessoarer_klockor')
                    break
                case 'Beauty':
                    catsArray.push('personligt')
                    break
                case "Other items > Children's articles & Toys":
                    catsArray.push('personligt')
                    catsArray.push('barnartiklar_leksaker')
                    break
                case 'Other items > Clothing':
                    catsArray.push('personligt')
                    catsArray.push('kläder_skor')
                    break
                case 'Other items > Consumer Electronics':
                    catsArray.push('elektronik')
                    break
                case 'Other items > Furniture & Decor':
                    catsArray.push('för_hemmet')
                    catsArray.push('möbler_heminredning')
                    break
                case 'Other items > Home':
                    catsArray.push('för_hemmet')
                    break
                case 'Other items > Homes':
                    catsArray.push('för_hemmet')
                    break
                case 'Other items > Leisure':
                    catsArray.push('fritid_hobby')
                    break
                case 'Other items > Media & Gaming':
                    catsArray.push('elektronik')
                    catsArray.push('datorer_tv-spel')
                    break
                case 'Other items > Shoes':
                    catsArray.push('personligt')
                    catsArray.push('kläder_skor')
                    break
                default:
                    catsArray.push('personligt')
                    break
            }
        })
        return catsArray
    }
}
