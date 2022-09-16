import { Inject } from '@nestjs/common'
import { ListingOrigin, Prisma, Category, Currency } from '@mewi/prisma'
import { ElementHandle } from 'puppeteer'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import { WatchOptions } from '../classes/types/WatchOptions'
import { PrismaService } from '@/prisma/prisma.service'
import { ScrapeContext } from '../classes/types/ScrapeContext'
import { ConfigService } from '@nestjs/config'

export class BytbilScraper extends ListingWebCrawler {
    baseUrl = 'https://bytbil.com/'
    defaultScrapeUrl = 'https://bytbil.com/'
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

    readonly watchOptions: WatchOptions = {
        findFirst: 'origin_id',
    }

    createScrapeUrl = (vehicleType: string, page: number): string => {
        return new URL(`/${vehicleType}?Page=${page}`, this.baseUrl).toString()
    }

    constructor(
        @Inject(PrismaService) prisma: PrismaService,
        @Inject(ConfigService) config: ConfigService
    ) {
        super(prisma, config, {
            listingSelector: '.result-list-item',
        })

        this.vehicleTypes.forEach((o, i) =>
            this.createEntryPoint(
                (p) => ({ url: this.createScrapeUrl(this.vehicleTypes[i], p) }),
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

    async evalParseRawListing(
        ele: ElementHandle<Element>,
        context: ScrapeContext
    ): Promise<Prisma.ListingCreateInput> {
        const listing = await ele.evaluate(async (ele) => {
            const href = ele.querySelector('.car-list-header > a')?.getAttribute('href')
            const priceString = ele
                .querySelector('.car-price-main')
                ?.textContent?.replace(/\D/g, '')

            return {
                origin_id: ele.querySelector('.uk-grid')?.getAttribute('data-model-id'),
                title: ele.querySelector('.car-list-header > a')?.textContent,
                // TODO
                // imageUrl: [],
                redirectUrl: href,
                isAuction: false,
                price: priceString
                    ? {
                          value: parseInt(priceString),
                      }
                    : undefined,
            }
        })

        if (!listing.origin_id) {
            throw new Error('Scraped listing has no title. Cannot create origin_id.')
        }

        return {
            ...listing,
            origin_id: this.createId(listing.origin_id),
            redirectUrl: listing.redirectUrl
                ? new URL(listing.redirectUrl, this.baseUrl).toString()
                : this.baseUrl,
            price: listing.price
                ? {
                      ...listing.price,
                      currency: Currency.SEK,
                  }
                : undefined,
            category: Category.FORDON,
            origin: ListingOrigin.Bytbil,
            date: new Date(),
            entryPoint: context.entryPoint.identifier,
        } as Prisma.ListingCreateInput
    }

    reset(): void {
        super.reset()
    }
}
