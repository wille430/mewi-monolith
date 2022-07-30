import { ScraperStatus, stringSimilarity } from '@wille430/common'
import { Prisma, ListingOrigin, Category, ScraperTrigger } from '@mewi/prisma'
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
    initialized = false

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

    async initialize(): Promise<void> {
        if (this.initialized) {
            throw new Error('Scraper is already initialized')
        }

        this.initialized = true
    }

    async start(options: Partial<StartScraperOptions> = {}) {
        if (!this.initialized) await this.initialize()

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
            let scrapeToValue: string | Date | undefined

            const recentLog = await entryPoint.getMostRecentLog()
            let findIndexValue: string | Date

            if (options.watchOptions.findFirst === 'date') {
                findIndexValue = recentLog?.scrapeToDate
            } else if (options.watchOptions.findFirst === 'origin_id') {
                findIndexValue = recentLog?.scrapeToId
            }

            let totalPageCount: number | undefined

            // Compose log
            this.log('', false)
            process.stdout.write(
                `Scraping ${maxScrapeCount ? maxScrapeCount : ''} listings from ${
                    (await entryPoint.createConfig(1)).url
                } `
            )

            let findIndex = undefined
            if (findIndexValue) {
                if (options.watchOptions.findFirst === 'date') {
                    process.stdout.write(`created after ${findIndexValue}`)
                    findIndex = (o) =>
                        new Date(o.date).getTime() <=
                        ((findIndexValue as Date) ?? new Date(0)).getTime()
                } else if (options.watchOptions.findFirst === 'origin_id') {
                    process.stdout.write(`until listing with origin_id ${findIndexValue} is found`)
                    findIndex = (o) => o.origin_id === findIndexValue
                }
            } else {
                process.stdout.write('until last page or max scrape count reached')
            }
            process.stdout.write('\n')

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

                if (page == 1 && listings.length > 0) {
                    scrapeToValue = listings[0][options.watchOptions.findFirst]
                }

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

            this.log(
                `Scraping of entrypoint ${entryPoint.identifier} complete. Deleting old listings and creating log...`
            )

            await this.deleteOldListings({
                entryPoint: entryPoint.identifier,
            })

            await this.prisma.scrapingLog.create({
                data: {
                    added_count: totalScrapedCount,
                    // TODO: correct error count value
                    error_count: 0,
                    entryPoint: entryPoint.identifier,
                    scrapeToDate: scrapeToValue instanceof Date ? scrapeToValue : undefined,
                    scrapeToId: typeof scrapeToValue === 'string' ? scrapeToValue : undefined,
                    target: this.origin,
                    triggered_by: options.triggeredBy,
                },
            })
        }

        this.log('DONE')

        this.reset()
    }

    private async deleteOldListings(
        args: Prisma.ListingDeleteManyArgs['where'] = {}
    ): Promise<void> {
        await this.prisma.listing.deleteMany({
            where: {
                date: {
                    lte: new Date(this.deleteOlderThan),
                },
                ...args,
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

    log(message: string, linebreak = true) {
        let completeMessage = `[${this.origin}]: ${message}`
        if (process.env.NODE_ENV === 'development' || this.verbose) {
            if (linebreak) console.log(completeMessage)
            else process.stdout.write(completeMessage)
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

    abstract createEntryPoint(createConfig: CreateConfigFunction, identifier?: string): void

    getTotalPages(arg: any): number | undefined {
        return undefined
    }
}
