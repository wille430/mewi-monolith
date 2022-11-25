import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { ApiEndPoint, ConfigMiddleware } from '../EndPoint'
import { ScrapePagination } from '../interface/scrape-pagination.inteface'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'
import { TraderaCategories } from './TraderaCategories'

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

export class TraderaEndPoint extends ApiEndPoint<Listing> {
    protected configMiddlewares: ConfigMiddleware[] = []
    private categoryHref: TraderaCategory['href']
    private baseUrl = 'https://www.tradera.com/'

    private parser: ListingParser = new ListingParser(ListingOrigin.Tradera, this)

    constructor(category: string) {
        super(category)
        this.categoryHref = category
    }

    protected createAxiosConfig({ page = 1 }: ScrapePagination): Promise<AxiosRequestConfig<any>> {
        return Promise.resolve({
            url: `https://www.tradera.com${this.categoryHref}.json?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&spage=${page}`,
        })
    }
    protected extractEntities(res: AxiosResponse<any, any>): any[] | Promise<any[]> {
        return res.data.items
    }

    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        return this.parser.parseListing({
            origin_id: this.parser.createId(obj.itemId.toString()),
            title: obj.shortDescription,
            category: this.parseCategories(this.categoryHref),
            date: obj.startDate ? new Date(obj.startDate) : new Date(),
            auctionEnd: new Date(obj.endDate),
            imageUrl: [obj.imageUrl],
            isAuction: !!obj.endDate || obj.itemType === 'auction',
            redirectUrl: new URL(obj.itemUrl, this.baseUrl).toString(),
            parameters: [],
            price: obj.price
                ? {
                      value: obj.price,
                      currency: Currency.SEK,
                  }
                : undefined,
        })
    }

    protected getScrapeMetadata(res: AxiosResponse<any, any>): Promise<ScrapeMetadata> {
        return Promise.resolve({
            totalPages: res.data.items,
        })
    }

    parseCategories(href: TraderaCategory['href']): Category {
        const title = TraderaCategories.find((o) => o.href == href)?.title
        switch (title) {
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
