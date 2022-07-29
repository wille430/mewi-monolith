import { Prisma } from '@mewi/prisma'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import robotsParser from 'robots-parser'
import { PrismaService } from '@/prisma/prisma.service'
import { Inject } from '@nestjs/common'
import { BaseEntryPoint, EntryPoint, ScrapeTargetType } from './EntryPoint'
import { BaseListingScraper } from './BaseListingScraper'

export type ScrapedListing = Prisma.ListingCreateInput

export type PageDetails = {
    url: string
    currentPage: number
    maxPages?: (res: AxiosResponse) => number
    getMostRecentDate: () => Date | undefined
}

export type GetBatchOptions<T extends ScrapeTargetType> = {
    maxScrapeCount?: number
    entryPoint: BaseEntryPoint<T>
    page: number
    findIndex?: (
        value: Prisma.ListingCreateInput,
        index: number,
        obj: Prisma.ListingCreateInput[]
    ) => boolean
    onTotalPageCount?: (pages: number) => any
}

export type WatchOptions = {
    findFirst: 'origin_id' | 'date'
}

export type GetBatchReturnObj = Promise<{
    listings: ScrapedListing[]
    continue: boolean
    reason?: 'MAX_COUNT' | 'MATCH_FOUND'
}>

export abstract class ListingScraper extends BaseListingScraper<'API'> {
    abstract entryPoints: EntryPoint[]

    constructor(@Inject(PrismaService) readonly prisma: PrismaService) {
        super()
        this.parseRawListing = this.parseRawListing.bind(this)
    }

    readonly defaultAxiosRequestConfig: AxiosRequestConfig = {}

    async createAxiosInstance(): Promise<AxiosInstance> {
        return axios.create()
    }

    /**
     * Override this function to find the array of unparsed listings
     *
     * @param res Axios Response object
     * @returns An array of objects of unknown shape
     */
    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data as any
    }
    parseRawListing(obj: Record<string, any>): ScrapedListing {
        return obj as any
    }

    /**
     * Get next batch of listings from scrape target
     *
     * @returns Object
     */
    public async getBatch(options: GetBatchOptions<'API'>): GetBatchReturnObj {
        const { entryPoint, onTotalPageCount } = options
        const client = await this.createAxiosInstance()

        const config = {
            ...this.defaultAxiosRequestConfig,
            ...(await entryPoint.createConfig(options.page)),
        }
        const res = await client(config)

        if (onTotalPageCount) {
            let maxPages = entryPoint.getTotalPages ? entryPoint.getTotalPages(res) : undefined
            onTotalPageCount(maxPages)
        }

        const data = this.extractRawListingsArray(res)
        const listings = data.map(this.parseRawListing)

        return this.createGetBatchReturn(listings, options)
    }
}
