import { Category, Currency, ListingOrigin, safeToDate } from '@/common/schemas'
import type { AxiosResponse } from 'axios'
import { autoInjectable, inject } from 'tsyringe'
import type { ScrapeContext } from '../classes/types/ScrapeContext'
import type { ScrapedListing } from '../classes/types/ScrapedListing'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import { ListingScraper } from '../classes/ListingScraper'
import { ListingsRepository } from '../../listings/listings.repository'

// TODO: find maximum offset
@autoInjectable()
export class CitiboardScraper extends ListingScraper {
    readonly defaultScrapeUrl = 'https://api42.citiboard.se/cb/annonslista'
    limit = 60

    baseUrl = 'https://citiboard.se/'
    origin: ListingOrigin = ListingOrigin.Citiboard

    constructor(
        @inject(ListingsRepository) listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) scrapingLogsRepository: ScrapingLogsRepository
    ) {
        super(listingsRepository, scrapingLogsRepository)

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))

        this.defaultStartOptions.watchOptions = {
            ...this.defaultStartOptions.watchOptions,
            findFirst: 'date',
        }
    }

    createScrapeUrl = (page: number) => this.defaultScrapeUrl + `?url=/&sida=${page}&sort=&sok=`

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.annonser
    }

    async parseRawListing(obj: Record<string, any>, context: ScrapeContext) {
        return {
            title: obj.rubrik,
            category: Category.OVRIGT,
            date: safeToDate(obj.skapad) ?? new Date(),
            imageUrl: obj.thumb
                ? [`https://citiboard-media.s3.eu-north-1.amazonaws.com/a/medium/${obj.thumb}`]
                : [],
            isAuction: false,
            origin: this.origin,
            origin_id: this.createId(obj.rubrik),
            redirectUrl: 'https://citiboard.se/annons/' + obj.permalink,
            price: obj.pris
                ? {
                      value: parseInt(obj.pris),
                      currency: Currency.SEK,
                  }
                : undefined,
            entryPoint: context.entryPoint.identifier,
        } as ScrapedListing
    }

    // async evalParseRawListing(ele: ElementHandle<Element>, context: ScrapeContext) {
    //     const listing: any = await ele.evaluate(async (ele) => {
    //         const imageUrl = ele.querySelector('.picture img')?.getAttribute('src')
    //         const priceString = ele.querySelector('.gridPrice')?.textContent

    //         return {
    //             origin_id: ele.getAttribute('id'),
    //             title: ele.querySelector('meta')?.content,
    //             imageUrl: imageUrl ? [imageUrl] : undefined,
    //             redirectUrl: ele.querySelector('.gridTitle a')?.getAttribute('href'),
    //             isAuction: false,
    //             price: priceString
    //                 ? {
    //                       value: parseFloat(priceString),
    //                   }
    //                 : undefined,
    //             region: ele.querySelector('.gridLocation span')?.textContent,
    //         }
    //     })

    //     return {
    //         ...listing,
    //         origin_id: this.createId(listing.origin_id),
    //         redirectUrl: new URL(listing.redirectUrl, this.baseUrl).toString(),
    //         price: listing.price
    //             ? {
    //                   value: listing.price.value,
    //                   currency: Currency.SEK,
    //               }
    //             : undefined,
    //         // TODO: assign correct category
    //         category: Category.OVRIGT,
    //         origin: this.origin,
    //         date: new Date(),
    //         entryPoint: context.entryPoint.identifier,
    //     } as ScrapedListing
    // }
}
