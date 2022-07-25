import { Inject } from '@nestjs/common'
import { Category, ListingOrigin, Currency } from '@mewi/prisma'
import axios from 'axios'
import puppeteer from 'puppeteer'
import { ListingScraper, ScrapedListing } from '../classes/ListingScraper.old'
import { PrismaService } from '@/prisma/prisma.service'

export class BlippScraper extends ListingScraper {
    maxPages?: number
    currentPage = 1
    perPage = 40
    buildId?: string

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma, ListingOrigin.Blipp, {
            baseUrl: 'https://blipp.se/',
            scrapeTargetUrl: 'https://blipp.se/fordon',
        })
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
                await page.goto(this.scrapeTargetUrl)

                token = await page.evaluate(() => {
                    const text = document.querySelector('#__NEXT_DATA__').textContent
                    const json: Record<any, any> = JSON.parse(text)

                    return json.buildId
                })
                this.buildId = token
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
            .then((res) => res.data.pageProps?.vehiclesData?.payload)

        this.perPage = payload.per_page
        this.maxPages = payload.pages

        return this.maxPages
    }

    /**
     * @param pageNum - the page to scrape. pageNum \>= 1
     * @returns An array of listings
     */
    async getListingOnPage(pageNum: number): Promise<ScrapedListing[]> {
        if (pageNum < 1) pageNum = 1

        let listings: ScrapedListing[] = []
        try {
            const url = `${await this.apiUrl()}?page=${pageNum}/`

            const rawListings = (await axios
                .get(url)
                .then((res) => res.data.pageProps?.vehiclesData?.payload.items)) as any[]

            listings = rawListings.map((obj) => this.parseRawListing(obj))
        } catch (e) {
            console.log(e)
        }

        return listings
    }

    async getBatch(): Promise<ScrapedListing[]> {
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

    parseRawListing({
        vehicle,
        published_date,
        cover_photo,
        entity_id,
        municipality,
    }: Record<string, any>): ScrapedListing {
        return {
            origin_id: this.createId(
                `${(vehicle.brand as string).toLowerCase().slice(0, 16)}_${vehicle.entity_id}`
            ),
            title: vehicle.car_name,
            category: Category.FORDON,
            date: new Date(published_date),
            imageUrl: [cover_photo.full_path],
            redirectUrl: `https://blipp.se/fordon/${entity_id}`,
            isAuction: false,
            price: vehicle.monthly_cost?.car_info_valuation
                ? {
                      value: parseFloat(
                          (vehicle.monthly_cost.car_info_valuation as string).replace(' ', '')
                      ),
                      currency: Currency.SEK,
                  }
                : null,
            region: municipality.name,
            origin: ListingOrigin.Blipp,
            auctionEnd: null,
        }
    }

    reset(): void {
        super.reset()
        this.currentPage = 1
    }
}
