import { ConfigService } from '@nestjs/config'
import { Inject } from '@nestjs/common'
import { Category, ListingOrigin, Currency, Prisma } from '@mewi/prisma'
import axios from 'axios'
import puppeteer from 'puppeteer'
import { Scraper } from './scraper'
import { PrismaService } from '@/prisma/prisma.service'

export class BlippScraper extends Scraper {
    maxPages?: number
    currentPage = 1
    perPage = 40
    buildId?: string

    constructor(@Inject(PrismaService) prisma: PrismaService, configService: ConfigService) {
        super(prisma, configService, ListingOrigin.Blipp, 'https://www.blipp.se/', {})
    }

    async apiUrl() {
        return `https://blipp.se/_next/data/${await this.getBuildId()}/fordon.json`
    }

    async getBuildId(): Promise<string | undefined> {
        if (this.buildId) {
            return this.buildId
        } else {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
            })
            let token: string | undefined
            try {
                const page = await browser.newPage()
                await page.goto('https://blipp.se/fordon')

                token = await page.evaluate(() => {
                    const text = document.querySelector('#__NEXT_DATA__').textContent
                    const json: Record<any, any> = JSON.parse(text)

                    return json.buildId
                })
            } catch (e) {
                console.log('Could not find token')
            } finally {
                await browser.close()
            }

            return token
        }
    }

    /**
     * Get the number of pages of products that are available
     */
    async numberOfPages(): Promise<number> {
        const payload = await axios
            .get(await this.apiUrl())
            .then((res) => res.data.pageProps?.data?.payload)

        this.perPage = payload.per_page
        this.maxPages = payload.pages

        return this.maxPages
    }

    /**
     * @param pageNum - the page to scrape. pageNum \>= 1
     * @returns An array of listings
     */
    async getListingOnPage(pageNum: number): Promise<Prisma.ListingCreateInput[]> {
        if (pageNum < 1) pageNum = 1

        let listings: Prisma.ListingCreateInput[] = []
        try {
            const url = `${await this.apiUrl()}?page=${pageNum}/`

            const rawListings = (await axios
                .get(url)
                .then((res) => res.data.pageProps?.data?.payload.items)) as any[]

            listings = rawListings.map(
                ({
                    vehicle,
                    published_date,
                    cover_photo,
                    entity_id,
                    municipality,
                }): Prisma.ListingCreateInput => ({
                    origin_id: `${(vehicle.brand as string).toLowerCase()}_${vehicle.entity_id}`,
                    title: vehicle.car_name,
                    body: null,
                    category: Category.FORDON,
                    date: new Date(published_date),
                    imageUrl: [cover_photo.full_path],
                    redirectUrl: `https://blipp.se/fordon/${entity_id}`,
                    isAuction: false,
                    price: vehicle.monthly_cost?.car_info_valuation
                        ? {
                              value: parseFloat(vehicle.monthly_cost.car_info_valuation),
                              currency: Currency.SEK,
                          }
                        : null,
                    region: municipality.name,
                    // TODO: parse parameters
                    parameters: [],
                    origin: ListingOrigin.Blipp,
                    auctionEnd: null,
                })
            )
        } catch (e) {
            console.log(e)
        }

        return listings
    }

    async getListings(): Promise<Prisma.ListingCreateInput[]> {
        if (!this.maxPages) {
            await this.numberOfPages()
        }

        if (this.currentPage > this.maxPages) {
            return []
        }

        const items = await this.getListingOnPage(this.currentPage)

        this.currentPage += 1

        return items
    }
}
