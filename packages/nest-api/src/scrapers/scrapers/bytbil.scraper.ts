import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ListingOrigin, Prisma } from '@mewi/prisma'
import { ElementHandle } from 'puppeteer'
import { Scraper, ScraperEvalArgs } from '../scraper'
import { ScraperType } from '../scraper-type.enum'
import { PrismaService } from '@/prisma/prisma.service'

export class BytbilScraper extends Scraper {
    vehicleTypes = [
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

    constructor(
        @Inject(PrismaService) prisma: PrismaService,
        @Inject(ConfigService) configService: ConfigService
    ) {
        super(prisma, configService, ListingOrigin.Bytbil, 'https://bytbil.com/', {
            scraperType: ScraperType.WEBSCRAPER,
        })

        // Webscraper specific options
        this.webscraper.listingSelector = '.result-list-item'
    }

    get calculatedScrapeCount() {
        if (this._calculatedScrapeCount) return this._calculatedScrapeCount

        const typesCount = this.vehicleTypes.length

        // eslint-disable-next-line no-async-promise-executor
        return new Promise<number>(async (resolve) => {
            resolve(Math.max(1, Math.floor((await this.quantityToScrape) / typesCount)))
        })
    }

    newVehicleTypesScrapedMap() {
        return this.vehicleTypes.reduce((prev, cur) => ({ ...prev, [cur]: 0 }), {})
    }

    async getListings(): Promise<Prisma.ListingCreateInput[]> {
        if (this._typeIndex + 1 >= this.vehicleTypes.length) {
            console.warn('Index is out of range! Please reset scraper to continue scraping.')
            return []
        }

        const countToScrape =
            (await this.calculatedScrapeCount) -
            this.vehicleTypesScrapedMap[this.vehicleTypes[this._typeIndex]]

        if (countToScrape <= 0) {
            this._typeIndex += 1
            return this.getListings()
        }

        const scrapeUrl = this.scrapeUrl + this.vehicleTypes[this._typeIndex]
        const listings = await this.evaluate(scrapeUrl, this.evalParseRawListing).then((arr) =>
            arr.slice(0, countToScrape)
        )

        this.vehicleTypesScrapedMap[this.vehicleTypes[this._typeIndex]] += listings.length

        return listings
    }

    async evalParseRawListing(ele: ElementHandle<Element>, args: ScraperEvalArgs) {
        const listing: Prisma.ListingCreateInput = await ele.evaluate(async (ele, args) => {
            const href = ele.querySelector('.car-list-header > a').getAttribute('href')

            return {
                origin_id: await (window as any).createId(
                    ele.querySelector('.uk-grid').getAttribute('data-model-id')
                ),
                title: ele.querySelector('.car-list-header > a').textContent,
                category: args.Category.FORDON,
                // TODO
                // imageUrl: [
                //     ele
                //         .querySelector('.car-image')
                //         .style.backgroundImage.split("('")[1],
                // ],
                redirectUrl: args.scrapeUrl.slice(0, -1) + href,
                isAuction: false,
                price: ele.querySelector('.car-price-main')?.textContent
                    ? {
                          value:
                              parseInt(
                                  ele
                                      .querySelector('.car-price-main')
                                      .textContent.replace(/\D/g, '')
                              ) ?? 0,
                          currency: args.Currency.SEK,
                      }
                    : null,
                origin: args.ListingOrigin.Bytbil,
                date: args.date,
            }
        }, args)

        return listing
    }

    reset(): void {
        super.reset()
        this._calculatedScrapeCount = undefined
        this._typeIndex = 0
    }
}
