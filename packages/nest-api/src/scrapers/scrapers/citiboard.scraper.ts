import { ListingOrigin, Prisma, Currency, Category } from '@mewi/prisma'
import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import puppeteer from 'puppeteer'
import { Scraper } from '../scraper'
import { PrismaService } from '@/prisma/prisma.service'

export class CitiboardScraper extends Scraper {
    baseUrl = 'https://citiboard.se'
    scrapeUrl = 'https://citiboard.se/hela-sverige'
    limit = 60

    constructor(@Inject(PrismaService) prisma: PrismaService, configService: ConfigService) {
        super(prisma, configService, ListingOrigin.Citiboard, 'https://www.blipp.se/', {})
    }

    nextPageUrl() {
        return this.scrapeUrl + `?offset=${this.listingScraped}`
    }

    async getListings(): Promise<Prisma.ListingCreateInput[]> {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()

            await page.goto(this.nextPageUrl())

            // Find item elements
            let listings: (Prisma.ListingCreateInput | null)[] = await page.$$eval(
                'article.gridItem',
                (eles, Currency: any, Category: any, ListingOrigin: any) =>
                    eles.map((ele): Prisma.ListingCreateInput | null => {
                        try {
                            return {
                                origin_id: ele.getAttribute('id'),
                                title: ele.querySelector('meta').content,
                                // TODO: assign correct category
                                category: Category.OVRIGT,
                                imageUrl: [ele.querySelector('.picture img').getAttribute('src')],
                                redirectUrl:
                                    this.baseUrl +
                                    ele.querySelector('.gridTitle a').getAttribute('href'),
                                isAuction: false,
                                price: {
                                    value: parseFloat(ele.querySelector('.gridPrice').textContent),
                                    currency: Currency.SEK,
                                },
                                region: ele.querySelector('.gridLocation span').textContent,
                                origin: ListingOrigin.Citiboard,
                            }
                        } catch (e) {
                            console.log(e)
                            return null
                        }
                    }),
                Currency,
                Category,
                ListingOrigin
            )

            listings = listings.filter((x) => x != null)

            return listings
        } finally {
            await browser.close()
        }
    }
}
