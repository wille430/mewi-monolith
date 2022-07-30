import { Inject } from '@nestjs/common'
import { Category, ListingOrigin, Currency } from '@mewi/prisma'
import { AxiosResponse } from 'axios'
import { NextScraper } from '../classes/NextScraper'
import { ScrapedListing } from '../classes/types/ScrapedListing'
import { PrismaService } from '@/prisma/prisma.service'
import { ScrapeContext } from '../classes/types/ScrapeContext'

export class BlippScraper extends NextScraper {
    baseUrl = 'https://blipp.se/'
    origin: ListingOrigin = ListingOrigin.Blipp
    limit = 40

    readonly defaultScrapeUrl = 'https://blipp.se/_next/data/{buildId}/fordon.json'

    createScrapeUrl = (page = 1) => {
        return `${this.defaultScrapeUrl}?page=${page}/`
    }

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma)

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))
    }

    getTotalPages(res: AxiosResponse): number {
        try {
            const payload = res.data.pageProps?.vehiclesData?.payload

            this.limit = payload.per_page

            return payload.pages
        } catch (e) {
            throw new Error(`Could not retrieve number of pages from ${this.baseUrl}, Reason: ${e}`)
        }
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.pageProps?.vehiclesData?.payload.items
    }

    parseRawListing(
        { vehicle, published_date, cover_photo, entity_id, municipality }: Record<string, any>,
        context: ScrapeContext
    ): ScrapedListing {
        return {
            origin_id: this.createId(
                `${(vehicle.brand as string).toLowerCase().slice(0, 16)}_${vehicle.entity_id}`
            ),
            title: vehicle.car_name,
            category: Category.FORDON,
            date: new Date(published_date),
            imageUrl: cover_photo ? [cover_photo.full_path] : [],
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
            entryPoint: context.entryPoint.identifier,
        }
    }
}
