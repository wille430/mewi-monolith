import { PrismaService } from '@/prisma/prisma.service'
import { ListingOrigin, Prisma, Category, Currency } from '@mewi/prisma'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosResponse } from 'axios'
import { ListingScraper } from '../classes/ListingScraper'
import { ScrapeContext } from '../classes/types/ScrapeContext'

export class KvdbilScraper extends ListingScraper {
    limit = 20
    origin = ListingOrigin.Kvdbil
    baseUrl = 'https://www.kvd.se/'

    createScrapeUrl = (page: number) => {
        const offset = (page - 1) * this.limit
        return `https://api.kvd.se/v1/auction/search?orderBy=-grade&auctionType=BUY_NOW&limit=${this.limit}&offset=${offset}`
    }

    constructor(
        @Inject(PrismaService) prisma: PrismaService,
        @Inject(ConfigService) config: ConfigService
    ) {
        super(prisma, config)

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))
    }

    getTotalPages(res: AxiosResponse): number {
        return Math.ceil(res.data.hits / this.limit)
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.auctions
    }

    parseRawListing(obj: Record<string, any>, context: ScrapeContext): Prisma.ListingCreateInput {
        return {
            origin_id: this.createId(obj.id),
            title: obj?.processObject?.title,
            category: Category.FORDON,
            date: new Date(obj.openedAt ?? new Date()),
            imageUrl: obj.previewImages.map((o: any) => o.uri),
            redirectUrl: obj.auctionUrl,
            isAuction: obj.processObject.state === 'AUCTION',
            price: obj.buyNowAmount
                ? {
                      value: obj.buyNowAmount,
                      currency: Currency.SEK,
                  }
                : undefined,
            origin: this.origin,
            entryPoint: context.entryPoint.identifier,
        }
    }
}
