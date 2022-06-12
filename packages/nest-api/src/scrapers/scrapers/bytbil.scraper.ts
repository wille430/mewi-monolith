import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ListingOrigin, Prisma, Category, Currency } from '@mewi/prisma'
import puppeteer from 'puppeteer'
import { Scraper } from '../scraper'
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
        super(prisma, configService, ListingOrigin.Shpock, 'https://bytbil.com/', {})
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

        const listings = await this.scrapeType(countToScrape)

        this.vehicleTypesScrapedMap[this.vehicleTypes[this._typeIndex]] += listings.length

        return listings
    }

    async scrapeType(count: number) {
        const scrapeUrl = this.scrapeUrl + this.vehicleTypes[this._typeIndex]

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()
            await page.goto(scrapeUrl)

            const rawListings = await page.evaluate(
                (count, Category, ListingOrigin, scrapeUrl) => {
                    const items = document.querySelectorAll('.result-list-item')
                    const rawListings: Prisma.ListingCreateInput[] = []
                    let scrapedCount = 0

                    items.forEach((ele) => {
                        if (scrapedCount >= count) {
                            return
                        }

                        const href = ele.querySelector('.car-list-header > a').getAttribute('href')

                        rawListings.push({
                            origin_id: `bytbil-${ele
                                .querySelector('.uk-grid')
                                .getAttribute('data-model-id')}`,
                            title: href.split('/')[2],
                            category: Category.FORDON,
                            date: new Date(),
                            // TODO
                            imageUrl: [ele.style.backgroundImage.split("('")[1]],
                            redirectUrl: scrapeUrl.slice(0, -1) + href,
                            isAuction: false,
                            price: ele.querySelector('car-price-main')?.textContent
                                ? {
                                      value:
                                          parseInt(
                                              ele
                                                  .querySelector('car-price-main')
                                                  .textContent.replace(/\D/g, '')
                                          ) ?? 0,
                                      currency: Currency.SEK,
                                  }
                                : null,
                            origin: ListingOrigin.Bytbil,
                        })

                        scrapedCount += 1
                    })

                    return rawListings
                },
                count,
                Category,
                ListingOrigin,
                this.scrapeUrl
            )

            await browser.close()
            return rawListings
        } catch (e) {
            console.error(e)
            await browser.close()
        }

        return []
    }

    reset(): void {
        super.reset()
        this._calculatedScrapeCount = undefined
        this._typeIndex = 0
    }
}
