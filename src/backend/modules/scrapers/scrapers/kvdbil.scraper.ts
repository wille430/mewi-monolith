import { Category, Currency, ListingOrigin } from '@/common/schemas'
import type { AxiosResponse } from 'axios'
import { autoInjectable, inject } from 'tsyringe'
import { ListingsRepository } from '../../listings/listings.repository'
import { ListingScraper } from '../classes/ListingScraper'
import type { ScrapeContext } from '../classes/types/ScrapeContext'
import type { ScrapedListing } from '../classes/types/ScrapedListing'
import { ScrapingLogsRepository } from '../scraping-logs.repository'

@autoInjectable()
export class KvdbilScraper extends ListingScraper {
    limit = 20
    origin = ListingOrigin.Kvdbil
    baseUrl = 'https://www.kvd.se/'

    createScrapeUrl = (page: number) => {
        const offset = (page - 1) * this.limit
        return `https://api.kvd.se/v1/auction/search?orderBy=-grade&auctionType=BUY_NOW&limit=${this.limit}&offset=${offset}`
    }

    constructor(
        @inject(ListingsRepository) listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) scrapingLogsRepository: ScrapingLogsRepository
    ) {
        super(listingsRepository, scrapingLogsRepository)

        this.createEntryPoint((p) => ({ url: this.createScrapeUrl(p) }))
    }

    getTotalPages(res: AxiosResponse): number {
        return Math.ceil(res.data.hits / this.limit)
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data.auctions
    }

    async parseRawListing(
        obj: Record<string, any>,
        context: ScrapeContext
    ): Promise<ScrapedListing> {
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
