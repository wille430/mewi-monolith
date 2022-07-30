import { ScraperStatus, stringSimilarity } from '@wille430/common'
import { ListingOrigin, Category, ScraperTrigger } from '@mewi/prisma'
import crypto from 'crypto'
import { CreateConfigFunction } from './types/CreateConfigFunction'
import { BaseEntryPoint } from './BaseEntryPoint'
import { ScrapedListing } from './types/ScrapedListing'
import { WatchOptions } from './types/WatchOptions'
import { StartScraperOptions } from '../types/startScraperOptions'
import { PrismaService } from '@/prisma/prisma.service'

export abstract class BaseListingScraper {
    status: ScraperStatus = ScraperStatus.IDLE
    useRobots = true
    verbose = false

    abstract limit: number
    abstract readonly baseUrl: string
    abstract readonly origin: ListingOrigin
    abstract entryPoints: BaseEntryPoint[]
    abstract createScrapeUrl: (...args: any) => string

    abstract prisma: PrismaService

    readonly watchOptions: WatchOptions = {
        findFirst: 'date',
    }
    readonly deleteOlderThan = Date.now() - 2 * 30 * 24 * 60 * 60 * 1000

    defaultStartOptions: Partial<StartScraperOptions> = {
        watchOptions: {
            findFirst: 'date',
        },
    }

    async start(options: Partial<StartScraperOptions> = {}) {
        options = {
            triggeredBy: ScraperTrigger.Scheduled,
            ...this.defaultStartOptions,
            ...options,
        }

        this.status = ScraperStatus.SCRAPING

        let batch: ScrapedListing[] = []
        let totalScrapedCount = 0

        this.log(`Scraping listings from ${this.entryPoints.length} entry points`)
        for (const entryPoint of this.entryPoints) {
            let shouldContinue = true
            let scrapeCount = 0
            let maxScrapeCount = options.scrapeCount
                ? Math.floor(options.scrapeCount / this.entryPoints.length)
                : undefined

            const getMostRecentListing = await entryPoint.getMostRecentListing()
            const findIndexValue = getMostRecentListing
                ? getMostRecentListing[options.watchOptions.findFirst]
                : undefined

            let totalPageCount: number | undefined

            this.log(
                `Scraping ${maxScrapeCount ? `${maxScrapeCount}` : ''} listings from ${
                    (await entryPoint.createConfig(1)).url
                }`
            )

            let findIndex = undefined
            if (options.watchOptions.findFirst === 'date') {
                this.log(`Scraping listings created after ${findIndexValue}`)
                findIndex = (o) =>
                    new Date(o.date).getTime() <=
                    ((findIndexValue as Date) ?? new Date(0)).getTime()
            } else if (options.watchOptions.findFirst === 'origin_id') {
                this.log(`Stopping scraping when finding listing with origin_id ${findIndexValue}`)
                findIndex = (o) => o.origin_id === findIndexValue
            }

            let page = 1
            while (shouldContinue) {
                this.log(`Scraping page ${page}/${totalPageCount ?? '?'}...`)

                const {
                    listings,
                    continue: cont,
                    maxPages,
                } = await entryPoint.scrape(page, {
                    findIndex,
                    maxScrapeCount,
                })
                totalPageCount = maxPages
                page += 1

                batch = listings
                shouldContinue = cont

                this.log(`Deleting listings in case duplicates are found`)
                await this.prisma.listing.deleteMany({
                    where: {
                        origin_id: { in: batch.map((x) => x.origin_id) },
                    },
                })

                this.log(`Inserting ${batch.length} listings into database`)

                // 1.5 Add the scraped listings
                if (batch.length) {
                    const { count } = await this.prisma.listing.createMany({
                        data: batch.map((o) => ({ ...o, entryPoint: entryPoint.identifier })),
                    })
                    scrapeCount += count
                    maxScrapeCount -= count
                }

                if (totalPageCount && page > totalPageCount) {
                    this.log(
                        'Scraper exceeded the total page count. Stopping scraper on this entry point.'
                    )
                    shouldContinue = false
                }
            }

            totalScrapedCount += scrapeCount
            if (options.onNextEntryPoint) options.onNextEntryPoint()
        }

        this.log('Scraping complete. Deleting old listings...')
        await this.deleteOldListings()
        this.log('DONE')

        this.reset()
    }

    private async deleteOldListings(): Promise<void> {
        await this.prisma.listing.deleteMany({
            where: {
                date: {
                    lte: new Date(this.deleteOlderThan),
                },
            },
        })
    }

    /**
     * Create an ID from a string
     *
     * @param string - A unique string
     * @returns An unique ID
     */
    createId(string: string) {
        const shasum = crypto.createHash('sha1')
        shasum.update(string)

        return `${this.origin}-${shasum.digest('hex')}`
    }

    log(message: string) {
        if (process.env.NODE_ENV === 'development' || this.verbose) {
            console.log(`[${this.origin}]: ${message}`)
        }
    }

    reset(): void {
        this.status = ScraperStatus.IDLE
    }

    stringToCategoryMap: Record<string, Category> = {}
    parseCategory(string: string): Category {
        if (this.stringToCategoryMap[string]) return this.stringToCategoryMap[string]

        if (Category[string.toUpperCase()]) return string.toUpperCase() as Category

        for (const category of Object.values(Category)) {
            const similarity = stringSimilarity(category, string) * 2
            if (similarity >= 0.7) {
                this.stringToCategoryMap[string] = category as Category
                return category as Category
            }
        }

        this.stringToCategoryMap[string] = Category.OVRIGT
        return Category.OVRIGT
    }

    abstract createEntryPoint(createConfig: CreateConfigFunction, identifier?: string)

    getTotalPages(arg: any): number | undefined {
        return undefined
    }
}
