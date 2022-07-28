import puppeteer, { ElementHandle } from 'puppeteer'
import {
    GetBatchOptions,
    ListingScraper,
    ListingScraperConstructorArgs,
    WatchOptions,
} from './ListingScraper'
import { ScrapedListing } from './ListingScraper'
import { NotImplementedException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma } from '@mewi/prisma'
import { EntryPointDOM } from './EntryPoint'

export type ListingWebCrawlerConstructorArgs = ListingScraperConstructorArgs & {
    listingSelector: string
}

export abstract class ListingWebCrawler extends ListingScraper {
    readonly listingSelector: string
    readonly useRobots: boolean = true
    readonly watchOptions: WatchOptions = {
        findFirst: 'date',
    }

    entryPoints: EntryPointDOM[] = []

    constructor(
        prisma: PrismaService,
        { listingSelector, ...options }: ListingWebCrawlerConstructorArgs
    ) {
        super(prisma, options)
        this.listingSelector = listingSelector
    }

    public override async getBatch(
        options: GetBatchOptions & {
            extractListings?: (page: puppeteer.Page) => Promise<any[]>
            jsonResult?: boolean
        }
    ): Promise<{
        listings: Prisma.ListingCreateInput[]
        continue: boolean
        reason?: 'MAX_COUNT' | 'MATCH_FOUND'
    }> {
        const { entryPoint, page: pageNb } = options

        // Instantiate puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()
            await page.goto(entryPoint.createUrl(pageNb))

            const items = options.extractListings
                ? await options.extractListings(page)
                : await page.$$(this.listingSelector)
            const scrapedListings = await Promise.all(
                items.map((ele) => ({
                    ...(options.jsonResult
                        ? this.parseRawListing(ele)
                        : this.evalParseRawListing(ele)),
                    entryPoint: options.entryPoint.identifier,
                }))
            )

            const listings = scrapedListings.map((x) => ({
                ...x,
                origin: this.origin,
                date: new Date(),
            })) as ScrapedListing[]

            return this.createGetBatchReturn(listings, options)
        } catch (e) {
            console.error(e)
            return this.createGetBatchReturn([], options)
        } finally {
            await browser.close()
        }
    }

    async evalParseRawListing(ele: ElementHandle<Element>): Promise<ScrapedListing> {
        throw new NotImplementedException()
    }
}
