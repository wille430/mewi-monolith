import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, ListingOrigin, Currency, Category } from '@mewi/prisma'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ElementHandle } from 'puppeteer'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import { ScrapeContext } from '../classes/types/ScrapeContext'
import { ScrapedListing } from '../classes/types/ScrapedListing'

export class BilwebScraper extends ListingWebCrawler {
    defaultScrapeUrl = 'https://bilweb.se/sok'
    limit = 30
    baseUrl = 'https://bilweb.se/'
    origin = ListingOrigin.Bilweb

    constructor(
        @Inject(PrismaService) prisma: PrismaService,
        @Inject(ConfigService) config: ConfigService
    ) {
        super(prisma, config, { listingSelector: '.Card-Wrapper > .Card' })

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))

        this.defaultStartOptions.watchOptions = {
            ...this.defaultStartOptions.watchOptions,
            findFirst: 'origin_id',
        }
    }

    createScrapeUrl = (page: number) => {
        const offset = (page - 1) * this.limit
        return this.defaultScrapeUrl + `?limit=${this.limit}&offset=${offset}`
    }

    async evalParseRawListing(
        ele: ElementHandle<Element>,
        context: ScrapeContext
    ): Promise<Prisma.ListingCreateInput> {
        const listing: any = await ele.evaluate(async (ele) => {
            const imageUrl = ele.querySelector('img.goToObject')?.getAttribute('src')
            const priceString = ele.querySelector('.Card-mainPrice')?.textContent

            return {
                origin_id: ele.getAttribute('id'),
                title: ele.querySelector('.Card-heading')?.textContent,
                imageUrl: imageUrl ? [imageUrl] : undefined,
                redirectUrl: ele.querySelector('.Card-heading a')?.getAttribute('href'),
                isAuction: false,
                price: priceString
                    ? {
                          value: parseFloat(priceString),
                      }
                    : undefined,
            }
        })

        return {
            ...listing,
            origin_id: this.createId(listing.origin_id),
            redirectUrl: this.baseUrl.toString(),
            price: listing.price
                ? {
                      value: listing.price.value,
                      currency: Currency.SEK,
                  }
                : undefined,
            category: Category.FORDON,
            origin: this.origin,
            date: new Date(),
            entryPoint: context.entryPoint.identifier,
        } as ScrapedListing
    }
}
