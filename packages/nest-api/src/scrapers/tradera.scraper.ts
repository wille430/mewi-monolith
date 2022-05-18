import axios from 'axios'
import { Scraper } from './scraper'
import { TraderaListing } from './types/traderaListing'
import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Category, Currency, ListingOrigin, Prisma } from '@mewi/prisma'

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

export class TraderaScraper extends Scraper {
    currentCategoryIndex = 0
    categories: TraderaCategory[] | undefined
    itemsPerCategory: number
    limit = 50

    constructor(@Inject(PrismaService) prisma: PrismaService, configService: ConfigService) {
        super(prisma, configService, ListingOrigin.Tradera, 'https://www.tradera.com/', {})
    }

    async getListings(): Promise<Prisma.ListingCreateInput[]> {
        if (!this.categories) this.categories = await this.getCategories()

        if (!this.categories[this.currentCategoryIndex]?.href) return []

        if (!this.itemsPerCategory)
            this.itemsPerCategory = Math.max(
                Math.ceil(this.maxEntries / this.categories.length),
                10
            )

        const url =
            'https://www.tradera.com' +
            this.categories[this.currentCategoryIndex].href +
            '.json' +
            '?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&spage=1'

        try {
            let traderaListing: TraderaListing[] = await axios
                .get(url)
                .then((res) => res.data.items)

            traderaListing = traderaListing.slice(0, this.itemsPerCategory)

            const listings: Prisma.ListingCreateInput[] = traderaListing.map(
                (item): Prisma.ListingCreateInput => ({
                    origin_id: item.itemId.toString(),
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
                })
            )

            this.currentCategoryIndex += 1
            return listings
        } catch (e) {
            console.log(e.stack)
            return []
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
}
