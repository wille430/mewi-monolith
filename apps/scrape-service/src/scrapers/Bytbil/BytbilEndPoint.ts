import type {Cheerio, CheerioAPI} from 'cheerio'
import {AbstractEndPoint} from '../EndPoint'
import {ListingParser} from '../ListingParser'
import {ScrapeMetadata} from '../Scraper'
import {Listing} from "@mewi/entities"
import {Currency, ListingOrigin} from "@mewi/models"
import axios from "axios"
import {load} from "cheerio"

export class BytbilEndPoint extends AbstractEndPoint<Listing, CheerioAPI, Cheerio<any>> {

    private category: string
    private baseUrl = 'https://bytbil.com/'
    private parser: ListingParser
    private readonly listSelector: string = ".result-list"
    private readonly itemSelector: string = ".result-list-item"

    constructor(category: string) {
        super(category)
        this.category = category
        this.parser = new ListingParser(ListingOrigin.Bytbil, this)
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

    private createUrl = (page: number) => {
        return `https://bytbil.com/${this.identifier}?Page=${page}`
    }

    protected async parseRawEntity(ele: Cheerio<any>): Promise<Partial<Listing>> {
        const href = ele.find('.car-list-header > a')?.attr('href')
        const priceString = ele.find('.car-price-main')?.text()?.replace(/\D/g, '')

        const imageEle = ele.find("div.car-image")
        const imageUrl = imageEle.attr('style').match(/background-image: url\((.*)\)/)?.at(1)

        return this.parser.parseListing({
            origin_id: ele.find('.uk-grid')?.attr('data-model-id'),
            title: ele.find('.car-list-header > a')?.text(),
            imageUrl: imageUrl ? [imageUrl] : [],
            isAuction: false,
            redirectUrl: href ? new URL(href, this.baseUrl).toString() : this.baseUrl,
            price: priceString
                ? {
                    value: parseInt(priceString),
                    currency: Currency.SEK,
                }
                : undefined,
            date: new Date(),
            category: await this.parser.parseCategory(this.category),
        })
    }

    protected getScrapeMetadata(res: CheerioAPI): Promise<ScrapeMetadata> {
        return Promise.resolve({})
    }
}
