import type { ElementHandle } from 'puppeteer'
import { Category, Currency, ListingOrigin } from '@wille430/common'
import { autoInjectable, inject } from 'tsyringe'
import { ListingWebCrawler } from '../classes/ListingWebCrawler'
import type { ScrapeContext } from '../classes/types/ScrapeContext'
import type { ScrapedListing } from '../classes/types/ScrapedListing'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import { ListingsRepository } from '../../listings/listings.repository'

@autoInjectable()
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

    createScrapeUrl = (vehicleType: string, page: number): string => {
        return new URL(`/${vehicleType}?Page=${page}`, this.baseUrl).toString()
    }

    constructor(
        @inject(ListingsRepository) listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) scrapingLogsRepository: ScrapingLogsRepository
    ) {
        super(listingsRepository, scrapingLogsRepository, {
            listingSelector: '.result-list-item',
        })

        this.vehicleTypes.forEach((o, i) =>
            this.createEntryPoint(
                (p) => ({ url: this.createScrapeUrl(this.vehicleTypes[i], p) }),
                o
            )
        )

        Object.assign(this.defaultStartOptions, {
            watchOptions: {
                findFirst: 'origin_id',
            },
        })
    }

    newVehicleTypesScrapedMap() {
        return this.vehicleTypes.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {})
    }

    async evalParseRawListing(
        ele: ElementHandle<Element>,
        context: ScrapeContext
    ): Promise<ScrapedListing> {
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
        } as ScrapedListing
    }

    reset(): void {
        super.reset()
    }
}
