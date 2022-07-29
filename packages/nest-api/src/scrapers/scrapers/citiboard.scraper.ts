import { ListingOrigin, Category, Currency } from '@mewi/prisma'
import { Inject } from '@nestjs/common'
import { ElementHandle } from 'puppeteer'
import { PrismaService } from '@/prisma/prisma.service'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import _ from 'lodash'
import { EntryPoint } from '../classes/EntryPoint'

// TODO: find maximum offset
export class CitiboardScraper extends ListingWebCrawler {
    readonly defaultScrapeUrl = 'https://citiboard.se/hela-sverige'
    limit = 60

    baseUrl: string = 'https://citiboard.se/'
    origin: ListingOrigin = ListingOrigin.Citiboard

    constructor(@Inject(PrismaService) readonly prisma: PrismaService) {
        super(prisma, { listingSelector: 'article.gridItem' })

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))

        this.defaultStartOptions.watchOptions = {
            ...this.defaultStartOptions.watchOptions,
            findFirst: 'origin_id',
        }
    }

    createScrapeUrl = (page: number) => this.defaultScrapeUrl + `?offset=${(page - 1) * this.limit}`

    async evalParseRawListing(ele: ElementHandle<Element>) {
        const listing: any = await ele.evaluate(async (ele) => ({
            origin_id: ele.getAttribute('id'),
            title: ele.querySelector('meta').content,
            imageUrl: [ele.querySelector('.picture img').getAttribute('src')],
            redirectUrl: ele.querySelector('.gridTitle a').getAttribute('href'),
            isAuction: false,
            price: ele.querySelector('.gridPrice') && {
                value: parseFloat(ele.querySelector('.gridPrice').textContent),
            },
            region: ele.querySelector('.gridLocation span').textContent,
        }))

        return {
            ...listing,
            origin_id: this.createId(listing.origin_id),
            redirectUrl: new URL(listing.redirectUrl, this.baseUrl).toString(),
            price: listing.price
                ? {
                      value: listing.price.value,
                      currency: Currency.SEK,
                  }
                : undefined,
            // TODO: assign correct category
            category: Category.FORDON,
            origin: ListingOrigin.Bytbil,
            date: new Date(),
        }
    }
}
