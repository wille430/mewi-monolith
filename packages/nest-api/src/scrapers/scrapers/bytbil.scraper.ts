import { Inject } from '@nestjs/common'
import { ListingOrigin, Prisma, Category, Currency } from '@mewi/prisma'
import { ElementHandle } from 'puppeteer'
import { PrismaService } from '@/prisma/prisma.service'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import { GetBatchOptions, WatchOptions } from '../classes/ListingScraper'
import { EntryPoint } from '../classes/EntryPoint'

export class BytbilScraper extends ListingWebCrawler {
    baseUrl: string = 'https://bytbil.com/'
    defaultScrapeUrl: string = 'https://bytbil.com/'
    origin: ListingOrigin = ListingOrigin.Bytbil

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
    _typeIndex = 0

    readonly watchOptions: WatchOptions = {
        findFirst: 'origin_id',
    }

    createScrapeUrl = (vehicleType: string, page: number): string => {
        return new URL(`/${vehicleType}?Page=${page}`, this.baseUrl).toString()
    }

    constructor(@Inject(PrismaService) readonly prisma: PrismaService) {
        super(prisma, {
            listingSelector: '.result-list-item',
        })

        this.vehicleTypes.forEach((o, i) =>
            this.createEntryPoint(
                (p) => ({ url: this.createScrapeUrl(this.vehicleTypes[i], p) }),
                null,
                o
            )
        )

        Object.assign(this.defaultStartOptions.watchOptions, {
            findFirst: 'origin_id',
        })
    }

    newVehicleTypesScrapedMap() {
        return this.vehicleTypes.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {})
    }

    public override async getBatch(options?: GetBatchOptions<'DOM'>): Promise<{
        listings: Prisma.ListingCreateInput[]
        continue: boolean
        reason?: 'MAX_COUNT' | 'MATCH_FOUND'
    }> {
        if (this._typeIndex + 1 >= this.vehicleTypes.length) {
            console.warn('Index is out of range! Please reset scraper to continue scraping.')
            return this.createGetBatchReturn([], options)
        }

        const returnObj = await super.getBatch(options)

        this.vehicleTypesScrapedMap[this.vehicleTypes[this._typeIndex]] += returnObj.listings.length

        return returnObj
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
            redirectUrl: new URL(listing.redirectUrl, this.baseUrl).toString(),
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
        this._typeIndex = 0
    }
}
