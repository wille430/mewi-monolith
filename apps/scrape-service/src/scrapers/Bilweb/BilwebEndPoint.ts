import type {Cheerio, CheerioAPI} from 'cheerio'
import {ListingParser} from '../ListingParser'
import {AbstractEndPoint} from "../EndPoint"
import {Listing} from "@mewi/entities"
import {Category, Currency, ListingOrigin} from "@mewi/models"
import {ScrapeMetadata} from "../Scraper"
import {load} from "cheerio"
import axios from "axios"

export class BilwebEndPoint extends AbstractEndPoint<Listing, CheerioAPI, Cheerio<any>> {
    private readonly parser: ListingParser
    private readonly baseUrl = 'https://bilweb.se/'
    private readonly limit = 30
    private readonly listSelector = ".Card-Wrapper"
    private readonly itemSelector = ".Card"

    constructor() {
        super(BilwebEndPoint.name)
        this.parser = new ListingParser(ListingOrigin.Bilweb, this)
    }

    protected createUrl({page = 1}: any): string {
        const offset = (page - 1) * this.limit
        return new URL(
            `/sok?query=&type=1&limit=${this.limit}&offset=${offset}`,
            this.baseUrl
        ).toString()
    }

    protected parseRawEntity(ele: Cheerio<any>): Promise<Partial<Listing>> | Partial<Listing> {
        const imageUrl = ele.find('img.goToObject')?.attr('src')
        const priceString = ele.find('.Card-mainPrice')?.text()
        const redirectPath = ele.find('.Card-heading a')?.attr('href')

        return this.parser.parseListing({
            title: ele.find('.Card-heading')?.text(),
            imageUrl: imageUrl ? [imageUrl] : undefined,
            isAuction: false,
            origin_id: this.parser.createId(ele.attr('id') as any),
            redirectUrl: redirectPath
                ? new URL(redirectPath, this.baseUrl).toString()
                : this.baseUrl,
            price: priceString
                ? {
                    value: parseFloat(priceString),
                    currency: Currency.SEK,
                }
                : undefined,
            category: Category.FORDON,
            date: new Date(),
        })
    }


    protected extractEntities($: CheerioAPI): Cheerio<any>[] | Promise<Cheerio<any>[]> {
        return $(`${this.listSelector} > ${this.itemSelector}`)
            .toArray()
            .map(node => $(node))
    }


    protected async getResponse(page: number): Promise<CheerioAPI> {
        const {data: html} = await axios.get(this.createUrl(page))
        return load(html)
    }

    protected getScrapeMetadata(res: any): Promise<ScrapeMetadata> {
        return Promise.resolve({})
    }

}
