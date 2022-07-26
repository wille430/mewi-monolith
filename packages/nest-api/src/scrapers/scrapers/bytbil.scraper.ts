import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ListingOrigin, Prisma, Category, Currency } from '@mewi/prisma'
import { ElementHandle } from 'puppeteer'
import { PrismaService } from '@/prisma/prisma.service'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import { ScrapedListing } from '../classes/ListingScraper'
import { resolveHref } from 'next/dist/shared/lib/router/router'

export class BytbilScraper extends ListingWebCrawler {
    readonly vehicleTypes = [
        'bil',
        'transportbil',
        'mc',
        'moped',
        'snoskoter',
        'fyrhjuling',
        'husbil',
        'husvagn',
        'slap',
    ]
    limit = 24

    vehicleTypesScrapedMap: Record<string, number> = this.newVehicleTypesScrapedMap()
    _calculatedScrapeCount: number | undefined
    _typeIndex = 0

    override getNextUrl(): string {
        return new URL(this.vehicleTypes[this._typeIndex], this.scrapeTargetUrl).toString()
    }

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma, {
            baseUrl: 'https://bytbil.com/',
            origin: ListingOrigin.Bytbil,
            listingSelector: '.result-list-item',
        })
    }

    newVehicleTypesScrapedMap() {
        return this.vehicleTypes.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {})
    }

    public override async getBatch(): Promise<Prisma.ListingCreateInput[]> {
        if (this._typeIndex + 1 >= this.vehicleTypes.length) {
            console.warn('Index is out of range! Please reset scraper to continue scraping.')
            return []
        }
        const listings = await super.getBatch()

        this.vehicleTypesScrapedMap[this.vehicleTypes[this._typeIndex]] += listings.length

        return listings
    }

    async evalParseRawListing(ele: ElementHandle<Element>): Promise<Prisma.ListingCreateInput> {
        const listing = await ele.evaluate(async (ele) => {
            const href = ele.querySelector('.car-list-header > a').getAttribute('href')

            return {
                origin_id: ele.querySelector('.uk-grid').getAttribute('data-model-id'),
                title: ele.querySelector('.car-list-header > a').textContent,
                // TODO
                // imageUrl: [],
                redirectUrl: href,
                isAuction: false,
                price: ele.querySelector('.car-price-main')?.textContent
                    ? {
                          value:
                              parseInt(
                                  ele
                                      .querySelector('.car-price-main')
                                      .textContent.replace(/\D/g, '')
                              ) ?? 0,
                      }
                    : null,
            }
        })

        return {
            ...listing,
            origin_id: this.createId(listing.origin_id),
            redirectUrl: this.scrapeTargetUrl.slice(0, -1) + listing.redirectUrl,
            price: {
                value: listing.price.value,
                currency: Currency.SEK,
            },
            category: Category.FORDON,
            origin: ListingOrigin.Bytbil,
            date: new Date(),
        } as Prisma.ListingCreateInput
    }

    reset(): void {
        super.reset()
        this._calculatedScrapeCount = undefined
        this._typeIndex = 0
    }
}
