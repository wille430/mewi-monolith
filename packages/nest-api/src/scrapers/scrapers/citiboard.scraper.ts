import { Prisma, ListingOrigin, Category, Currency } from '@mewi/prisma'
import { Inject } from '@nestjs/common'
import { ElementHandle } from 'puppeteer'
import { PrismaService } from '@/prisma/prisma.service'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import _ from 'lodash'

export class CitiboardScraper extends ListingWebCrawler {
    readonly _scrapeTargetUrl = 'https://citiboard.se/hela-sverige'
    limit = 60
    offset = 0

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma, {
            baseUrl: 'https://www.citiboard.se/',
            origin: ListingOrigin.Citiboard,
            listingSelector: 'article.gridItem',
        })
    }

    getNextUrl() {
        return this.scrapeTargetUrl + `?offset=${this.offset}`
    }

    async getBatch(): Promise<Prisma.ListingCreateInput[]> {
        const listings = await super.getBatch()

        this.offset += this.limit
        return listings
    }

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

        return Object.assign(listing, {
            origin_id: this.createId(listing.origin_id),
            redirectUrl: new URL(listing.redirectUrl, this.baseUrl),
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
        })
    }
}
