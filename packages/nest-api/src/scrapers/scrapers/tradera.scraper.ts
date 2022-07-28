import axios, { AxiosResponse } from 'axios'
import { Inject } from '@nestjs/common'
import { Category, Currency, ListingOrigin, Prisma } from '@mewi/prisma'
import { PrismaService } from '@/prisma/prisma.service'
import { GetBatchOptions, ListingScraper } from '../classes/ListingScraper'
import { StartScraperOptions } from '../types/startScraperOptions'
import { EntryPoint } from '../classes/EntryPoint'

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

    createScrapeUrl(category: string, page) {
        return `https://www.tradera.com${category}.json?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&spage=${page}`
    }

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma, {
            baseUrl: 'https://www.tradera.com/',
            origin: ListingOrigin.Tradera,
        })
        this.parseRawListing = this.parseRawListing.bind(this)
    }

    async start(options?: Partial<StartScraperOptions>): Promise<void> {
        if (!this.categories) {
            this.log('Fetching categories and updating entry points...')
            this.categories = await this.getCategories()

            this.entryPoints = this.categories.map((o, i) =>
                EntryPoint.create<'API'>(
                    this.prisma,
                    (p) => this.createScrapeUrl(this.categories[i].href, p),
                    (res) => res.data.pagination.pageCount,
                    o.href
                )
            )
        }

        super.start(options)
    }

    public override async getBatch(options?: GetBatchOptions): Promise<{
        listings: Prisma.ListingCreateInput[]
        continue: boolean
        reason?: 'MAX_COUNT' | 'MATCH_FOUND'
    }> {
        if (!this.categories[this.currentCategoryIndex]?.href)
            this.createGetBatchReturn([], options)
        return await super.getBatch(options)
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.items
    }

    parseRawListing(item: Record<string, any>): Prisma.ListingCreateInput {
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
