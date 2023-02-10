import type {AxiosResponse} from 'axios'
import axios from 'axios'
import {ListingParser} from '../ListingParser'
import {ScrapeMetadata} from '../Scraper'
import {TraderaCategories} from './TraderaCategories'
import {AbstractEndPoint} from "../EndPoint"
import {Listing} from "@mewi/entities"
import {Category, Currency, ListingOrigin} from "@mewi/models"

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

export class TraderaEndPoint extends AbstractEndPoint<Listing, AxiosResponse, any> {
    private categoryHref: TraderaCategory['href']
    private baseUrl = 'https://www.tradera.com/'

    private parser: ListingParser

    constructor(category: string) {
        super(category)
        this.categoryHref = category
        this.parser = new ListingParser(ListingOrigin.Tradera, this)
    }

    protected getResponse(page: number): Promise<AxiosResponse> {
        return axios({
            url: `https://www.tradera.com${this.categoryHref}.json?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&spage=${page}`,
        })
    }

    protected extractEntities(res: AxiosResponse): any | Promise<any> {
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

    protected getScrapeMetadata(res: AxiosResponse): Promise<ScrapeMetadata> {
        return Promise.resolve({
            totalPages: res.data.items,
        })
    }

    private parseCategories(href: TraderaCategory['href']): Category {
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
}
