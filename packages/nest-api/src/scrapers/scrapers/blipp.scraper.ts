import { Inject } from '@nestjs/common'
import { Category, ListingOrigin, Currency } from '@mewi/prisma'
import { PrismaService } from '@/prisma/prisma.service'
import { NextScraper } from '../classes/NextScraper'
import { ScrapedListing } from '../classes/ListingScraper'

export class BlippScraper extends NextScraper {
    maxPages?: number
    currentPage = 1
    perPage = 40

    readonly _scrapeTargetUrl = 'https://blipp.se/_next/data/{buildId}/fordon.json'

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma, {
            baseUrl: 'https://blipp.se/',
            origin: ListingOrigin.Blipp,
        })
    }

    /**
     * Get the number of pages of products that are available
     */
    async numberOfPages(): Promise<number> {
        try {
            this.client = await this.createAxiosInstance()
            const payload = await this.client
                .get(this.scrapeTargetUrl)
                .then((res) => res.data.pageProps?.vehiclesData?.payload)

            this.perPage = payload.per_page
            this.maxPages = payload.pages

            return this.maxPages
        } catch (e) {
            throw new Error(`Could not retrieve number of pages from ${this.baseUrl}`)
        }
    }

    /**
     * @param pageNum - the page to scrape. pageNum \>= 1
     * @returns An array of listings
     */
    async getListingsOnPage(pageNum: number): Promise<ScrapedListing[]> {
        pageNum = Math.max(pageNum, 1)

        let listings: ScrapedListing[] = []
        try {
            const url = `${this.scrapeTargetUrl}?page=${pageNum}/`

            const rawListings = (await this.client
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

        const items = await this.getListingsOnPage(this.currentPage)

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
