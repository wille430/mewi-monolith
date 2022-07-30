import axios, { AxiosResponse } from 'axios'
import { Inject } from '@nestjs/common'
import { Category, Currency, ListingOrigin, Prisma } from '@mewi/prisma'
import { ListingScraper } from '../classes/ListingScraper'
import { StartScraperOptions } from '../types/startScraperOptions'
import { PrismaService } from '@/prisma/prisma.service'
import { ScrapeContext } from '../classes/types/ScrapeContext'

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

export class TraderaScraper extends ListingScraper {
    currentCategoryIndex = 0
    categories: TraderaCategory[] | undefined

    itemsPerCategory: number
    limit = 50

    baseUrl = 'https://www.tradera.com/'
    origin: ListingOrigin = ListingOrigin.Tradera

    createScrapeUrl = (category: string, page) => {
        return `https://www.tradera.com${category}.json?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&spage=${page}`
    }

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma)

        this.defaultStartOptions = {
            onNextEntryPoint: () => {
                this.currentCategoryIndex += 1
            },
        }
    }

    async start(options?: Partial<StartScraperOptions>): Promise<void> {
        if (!this.categories) {
            this.log('Fetching categories and updating entry points...')
            this.categories = await this.getCategories()

            this.categories.forEach((o, i) => {
                this.createEntryPoint(
                    (p) => ({
                        url: this.createScrapeUrl(this.categories[i].href, p),
                    }),
                    o.href
                )
            })
        }

        super.start(options)
    }

    getTotalPages(res: AxiosResponse): number {
        return res.data.pagination.pageCount
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.items
    }

    parseRawListing(
        item: Record<string, any>,
        scrapeContext: ScrapeContext
    ): Prisma.ListingCreateInput {
        return {
            origin_id: this.createId(item.itemId.toString()),
            title: item.shortDescription,
            category: this.parseCategories(
                (this.categories ?? {})[this.currentCategoryIndex].title
            ),
            date: item.startDate ? new Date(item.startDate) : new Date(),
            auctionEnd: new Date(item.endDate),
            body: null,
            region: null,
            imageUrl: [item.imageUrl],
            isAuction: !!item.endDate || item.itemType === 'auction',
            redirectUrl: this.baseUrl + item.itemUrl,
            parameters: [],
            price: item.price
                ? {
                      value: item.price,
                      currency: Currency.SEK,
                  }
                : null,
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
