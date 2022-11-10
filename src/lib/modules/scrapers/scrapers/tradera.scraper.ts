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
    categories = [
        { href: '/category/1612', title: 'Accessoarer' },
        { href: '/category/20', title: 'Antikt & Design' },
        { href: '/category/1611', title: 'Barnartiklar' },
        { href: '/category/33', title: 'Barnkläder & Barnskor' },
        { href: '/category/302571', title: 'Barnleksaker' },
        { href: '/category/34', title: 'Biljetter & Resor' },
        { href: '/category/32', title: 'Bygg & Verktyg' },
        { href: '/category/11', title: 'Böcker & Tidningar' },
        { href: '/category/12', title: 'Datorer & Tillbehör' },
        { href: '/category/13', title: 'DVD & Videofilmer' },
        { href: '/category/10', title: 'Fordon, Båtar & Delar' },
        { href: '/category/14', title: 'Foto, Kameror & Optik' },
        { href: '/category/15', title: 'Frimärken' },
        { href: '/category/36', title: 'Handgjort & Konsthantverk' },
        { href: '/category/31', title: 'Hem & Hushåll' },
        { href: '/category/17', title: 'Hemelektronik' },
        { href: '/category/18', title: 'Hobby' },
        { href: '/category/19', title: 'Klockor' },
        { href: '/category/16', title: 'Kläder' },
        { href: '/category/23', title: 'Konst' },
        { href: '/category/21', title: 'Musik' },
        { href: '/category/22', title: 'Mynt & Sedlar' },
        { href: '/category/29', title: 'Samlarsaker' },
        { href: '/category/1623', title: 'Skor' },
        { href: '/category/340736', title: 'Skönhetsvård' },
        { href: '/category/24', title: 'Smycken & Ädelstenar' },
        { href: '/category/25', title: 'Sport & Fritid' },
        { href: '/category/26', title: 'Telefoni, Tablets & Wearables' },
        { href: '/category/1605', title: 'Trädgård & Växter' },
        { href: '/category/30', title: 'TV-spel & Datorspel' },
        { href: '/category/27', title: 'Vykort & Bilder' },
    ]

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

        for (const category of this.categories) {
            this.createEntryPoint(
                (p) => ({
                    url: this.createScrapeUrl(category.href, p),
                }),
                category.href
            )
        }

        this.config.onNextEntryPoint = () => {
            this.currentCategoryIndex += 1
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
