import type {AxiosResponse} from 'axios'
import {ListingParser} from '../ListingParser'
import {ScrapeMetadata} from '../Scraper'
import {AbstractEndPoint} from "../EndPoint"
import {Listing} from "@mewi/entities"
import {Category, Currency, ListingOrigin} from "@mewi/models"
import axios from "axios"

export class KvdBilEndPoint extends AbstractEndPoint<Listing, AxiosResponse, any> {
    private limit = 20
    private parser: ListingParser = new ListingParser(ListingOrigin.Kvdbil, this)

    constructor() {
        super(KvdBilEndPoint.name)
    }

    protected getResponse(page: number): Promise<AxiosResponse> {
        const offset = (page - 1) * this.limit
        return axios({
            url: `https://api.kvd.se/v1/auction/search?orderBy=-grade&auctionType=BUY_NOW&limit=${this.limit}&offset=${offset}`,
        })
    }

    protected extractEntities(res: AxiosResponse): any[] | Promise<any[]> {
        return res.data.auctions
    }

    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        return this.parser.parseListing({
            origin_id: this.parser.createId(obj.id),
            title: obj?.processObject?.title,
            category: Category.FORDON,
            date: new Date(obj.openedAt ?? new Date()),
            imageUrl: obj.previewImages.map((o: any) => o.uri),
            redirectUrl: obj.auctionUrl,
            isAuction: obj.processObject.state === 'AUCTION',
            price: obj.buyNowAmount
                ? {
                    value: obj.buyNowAmount,
                    currency: Currency.SEK,
                }
                : undefined,
        })
    }

    protected getScrapeMetadata(res: AxiosResponse): Promise<ScrapeMetadata> {
        return Promise.resolve({
            totalPages: Math.ceil(res.data.hits / this.limit),
        })
    }
}
