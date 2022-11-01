import type { AxiosResponse } from 'axios'
import axios from 'axios'
import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { autoInjectable, inject } from 'tsyringe'
import type { ScrapeContext } from '../classes/types/ScrapeContext'
import { ListingScraper } from '../classes/ListingScraper'
import type { ScrapedListing } from '../classes/types/ScrapedListing'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import { ListingsRepository } from '../../listings/listings.repository'

interface TraderaCategory {
    id: number
    title: string
    href?: string
    categoryNodes: {
        title: string
        href?: string
        isTopLevel: boolean
        isSpaRoute: boolean
    }[]
}

@autoInjectable()
export class TraderaScraper extends ListingScraper {
    currentCategoryIndex = 0
    categories: TraderaCategory[] | undefined

    itemsPerCategory!: number
    limit = 50

    baseUrl = 'https://www.tradera.com/'
    origin: ListingOrigin = ListingOrigin.Tradera

    createScrapeUrl = (category: string, page: number) => {
        return `https://www.tradera.com${category}.json?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&spage=${page}`
    }

    constructor(
        @inject(ListingsRepository) listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) scrapingLogsRepository: ScrapingLogsRepository
    ) {
        super(listingsRepository, scrapingLogsRepository)

        Object.assign(this.defaultStartOptions, {
            onNextEntryPoint: () => {
                this.currentCategoryIndex += 1
            },
        })
    }

    async initialize(): Promise<void> {
        await super.initialize()

        this.log('Fetching categories and updating entry points...')
        this.categories = await this.getCategories()

        for (const category of this.categories) {
            if (!category.href == null) {
                throw new Error(
                    `Href to Tradera ${category.id} is undefined. Could not create entrypoint for category.`
                )
            }

            this.createEntryPoint(
                (p) => ({
                    url: this.createScrapeUrl(category.href!, p),
                }),
                category.href
            )
        }
    }

    getTotalPages(res: AxiosResponse): number {
        return res.data.pagination.pageCount
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.items
    }

    async parseRawListing(
        item: Record<string, any>,
        scrapeContext: ScrapeContext
    ): Promise<ScrapedListing> {
        return {
            origin_id: this.createId(item.itemId.toString()),
            title: item.shortDescription,
            category: this.parseCategories(
                (this.categories ?? [])[this.currentCategoryIndex].title
            ),
            date: item.startDate ? new Date(item.startDate) : new Date(),
            auctionEnd: new Date(item.endDate),
            imageUrl: [item.imageUrl],
            isAuction: !!item.endDate || item.itemType === 'auction',
            redirectUrl: new URL(item.itemUrl, this.baseUrl).toString(),
            parameters: [],
            price: item.price
                ? {
                      value: item.price,
                      currency: Currency.SEK,
                  }
                : undefined,
            origin: ListingOrigin.Tradera,
            entryPoint: scrapeContext.entryPoint.identifier,
        }
    }

    parseCategories(traderaCategory: TraderaCategory['title']): Category {
        switch (traderaCategory) {
            case 'Antikt & Design':
            case 'Bygg & Verktyg':
            case 'Konst':
            case 'Trädgård & Växter':
                return Category.FOR_HEMMET
            case 'Datorer & Tillbehör':
            case 'DVD & Videofilmer':
            case 'Foto, Kameror & Optik':
            case 'Hemelektronik':
            case 'Musik':
            case 'Telefoni, Tablets & Wearables':
            case 'TV-spel & Datorspel':
                return Category.ELEKTRONIK
            case 'Fordon, Båtar & Delar':
                return Category.FORDON
            case 'Sport & Fritid':
            case 'Hobby':
            case 'Biljetter & Tidningar':
            case 'Samlarsaker':
                return Category.FRITID_HOBBY
            case 'Övrigt':
            case 'Rabattkoder':
            case 'Vykort & Bilder':
                return Category.OVRIGT
            default:
                return Category.PERSONLIGT
        }
    }

    async getCategories() {
        const url = 'https://www.tradera.com/categories'
        const categoriesData: TraderaCategory[] = await axios.get(url).then((res) => res.data)

        categoriesData.pop()

        return categoriesData
    }

    reset(): void {
        super.reset()
        this.currentCategoryIndex = 0
    }
}
