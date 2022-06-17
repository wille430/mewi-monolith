import { ListingOrigin, Prisma } from '@mewi/prisma'
import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { ElementHandle } from 'puppeteer'
import { Scraper, ScraperEvalArgs } from '../scraper'
import { ScraperType } from '../scraper-type.enum'
import { PrismaService } from '@/prisma/prisma.service'

export class CitiboardScraper extends Scraper {
    baseUrl = 'https://citiboard.se'
    scrapeUrl = 'https://citiboard.se/hela-sverige'
    limit = 60

    constructor(
        @Inject(PrismaService) prisma: PrismaService,
        @Inject(ConfigService) configService: ConfigService
    ) {
        super(prisma, configService, ListingOrigin.Citiboard, 'https://www.blipp.se/', {
            scraperType: ScraperType.WEBSCRAPER,
        })
    }

    nextPageUrl() {
        return this.scrapeUrl + `?offset=${this.listingScraped}`
    }

    async getListings(): Promise<Prisma.ListingCreateInput[]> {
        return this.evaluate(this.nextPageUrl(), this.evalParseRawListing)
    }

    async evalParseRawListing(ele: ElementHandle<Element>, args: ScraperEvalArgs) {
        const listing: Prisma.ListingCreateInput = await ele.evaluate(
            async (ele, args: ScraperEvalArgs) => ({
                origin_id: await (window as any).createId(ele.getAttribute('id')),
                title: ele.querySelector('meta').content,
                // TODO: assign correct category
                category: args.Category.OVRIGT,
                imageUrl: [ele.querySelector('.picture img').getAttribute('src')],
                redirectUrl:
                    args.scrapeUrl + ele.querySelector('.gridTitle a').getAttribute('href'),
                isAuction: false,
                price: {
                    value: parseFloat(ele.querySelector('.gridPrice').textContent),
                    currency: args.Currency.SEK,
                },
                region: ele.querySelector('.gridLocation span').textContent,
                origin: args.ListingOrigin.Citiboard,
            }),
            args
        )

        return listing
    }
}
