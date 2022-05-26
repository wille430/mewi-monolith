import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ListingOrigin, Prisma, ScraperTrigger } from '@mewi/prisma'
import { ScraperStatus } from '@wille430/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { BlocketScraper } from './blocket.scraper'
import { TraderaScraper } from './tradera.scraper'
import { SellpyScraper } from './sellpy.scraper'
import { BlippScraper } from './blipp.scraper'
import { Scraper } from './scraper'
import { StartScraperOptions } from './types/startScraperOptions'
import { RunPipelineEvent } from './events/run-pipeline.event'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class ScrapersService {
    scrapers: Partial<Record<ListingOrigin, Scraper>> = {}
    scraperPipeline: [ListingOrigin, StartScraperOptions][] = []

    constructor(
        private blocketScraper: BlocketScraper,
        private traderaScraper: TraderaScraper,
        private blippScraper: BlippScraper,
        private sellpyScraper: SellpyScraper,
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ) {
        this.scrapers = {
            Blocket: this.blocketScraper,
            Tradera: this.traderaScraper,
            Blipp: this.blippScraper,
            Sellpy: this.sellpyScraper,
        }
    }

    @OnEvent('pipeline.run')
    async handlePipelineRunEvent(payload: RunPipelineEvent) {
        const totalScraperCount = this.scraperPipeline.length
        let currentIndex = 0

        const nextScraper = () => this.scraperPipeline.shift()
        const startScraperNext = async () => {
            const [name, args] = nextScraper()
            currentIndex += 1

            console.log(`[${currentIndex}/${totalScraperCount}] Scraping ${name}...`)
            await this.scrapers[name].start(args)

            console.log(
                `[${currentIndex}/${totalScraperCount}] Deleting old listings from ${name}...`
            )
            await this.scrapers[name].deleteOld()
        }

        if (payload.count === -1) {
            // run all
            while (this.scraperPipeline.length > 0) {
                await startScraperNext()
            }
        } else {
            while (payload.count > 0 && this.scraperPipeline.length > 0) {
                await startScraperNext()
                payload.count -= 1
            }
        }
    }

    @Cron('* */45 * * *')
    async startAll(...args: Parameters<Scraper['start']>) {
        for (const [name] of Object.entries(this.scrapers)) {
            this.scraperPipeline.push([
                name as ListingOrigin,
                { triggeredBy: ScraperTrigger.Scheduled, ...args },
            ])
        }

        this.eventEmitter.emit('pipeline.run', new RunPipelineEvent())
    }

    async start(
        scraperName: ListingOrigin,
        options: StartScraperOptions = { triggeredBy: ScraperTrigger.Scheduled }
    ): Promise<ScraperStatus> {
        let foundScraper: Scraper | undefined = undefined

        for (const [name, scraper] of Object.entries(this.scrapers)) {
            if (name === scraperName) {
                foundScraper = scraper
            }
        }

        if (foundScraper) {
            this.scraperPipeline.push([scraperName, options])

            const listingCount = await this.prisma.listing.count({
                where: {
                    origin: foundScraper.name,
                },
            })

            this.eventEmitter.emit('pipeline.run', new RunPipelineEvent())

            return {
                started: true,
                listings_current: listingCount,
                listings_remaining: foundScraper.maxEntries - listingCount,
            }
        } else {
            throw new NotFoundException({
                statusCode: 404,
                message: [`no scraper named ${scraperName}`],
                error: 'Not Found',
            })
        }
    }

    async status(): Promise<Record<ListingOrigin, ScraperStatus>> {
        const allScraperStatus: Partial<ReturnType<typeof this.status>> = {}

        for (const key of Object.keys(ListingOrigin)) {
            const scraper = this.scrapers[key]

            const listingCount = await this.prisma.listing.count({
                where: {
                    origin: key as ListingOrigin,
                },
            })

            allScraperStatus[key] = {
                started: scraper.isScraping,
                listings_current: listingCount,
                listings_remaining: scraper.maxEntries - listingCount,
            }
        }

        return allScraperStatus as ReturnType<typeof this.status>
    }

    async getLogs(dto: Prisma.ScrapingLogFindManyArgs) {
        return await this.prisma.scrapingLog.findMany(dto)
    }
}
