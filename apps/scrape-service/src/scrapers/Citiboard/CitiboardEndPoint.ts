import type {AxiosResponse} from 'axios'
import {ListingParser} from '../ListingParser'
import {ScrapeMetadata} from '../Scraper'
import {AbstractEndPoint} from "../EndPoint"
import {Listing} from "@mewi/entities"
import {Category, Currency, ListingOrigin} from "@mewi/models"
import axios from "axios"
import {safeToDate} from "@mewi/utilities"

export class CitiboardEndPoint extends AbstractEndPoint<Listing, AxiosResponse, any> {
    private parser: ListingParser

    constructor() {
        super(CitiboardEndPoint.name)
        this.parser = new ListingParser(ListingOrigin.Citiboard, this)
    }

    protected getResponse(page: number): Promise<AxiosResponse> {
        return axios({
            url: `https://api42.citiboard.se/cb/annonslista?url=/&sida=${page}&sort=&sok=`,
        })
    }

    protected extractEntities(res: AxiosResponse): any[] | Promise<any[]> {
        return res.data.annonser
    }

    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        return this.parser.parseListing({
            title: obj.rubrik,
            category: Category.OVRIGT,
            date: safeToDate(obj.skapad) ?? new Date(),
            imageUrl: obj.thumb
                ? [`https://citiboard-media.s3.eu-north-1.amazonaws.com/a/medium/${obj.thumb}`]
                : [],
            isAuction: false,
            origin_id: this.parser.createId(obj.annons_id),
            redirectUrl: 'https://citiboard.se/annons/' + obj.permalink,
            price: obj.pris
                ? {
                    value: parseInt(obj.pris),
                    currency: Currency.SEK,
                }
                : undefined,
        })
    }

    protected getScrapeMetadata(): Promise<ScrapeMetadata> {
        return Promise.resolve({})
    }
}
