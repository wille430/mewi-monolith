import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ListingOrigin, Prisma, ScraperTrigger } from '@mewi/prisma'
import { ScraperStatus } from '@wille430/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { BlocketScraper } from './scrapers/blocket.scraper'
import { SellpyScraper } from './scrapers/sellpy.scraper'
import { TraderaScraper } from './scrapers/tradera.scraper'
import { BlippScraper } from './scrapers/blipp.scraper'
import { Scraper } from './scraper'
import { StartScraperOptions } from './types/startScraperOptions'
import { RunPipelineEvent } from './events/run-pipeline.event'
import { CitiboardScraper } from './scrapers/citiboard.scraper'
import { ShpockScraper } from './scrapers/shpock.scraper'
import { BytbilScraper } from './scrapers/bytbil.scraper'
import { PrismaService } from '@/prisma/prisma.service'

const pipelineQueue: RunPipelineEvent[] = []
const scraperPipeline: [ListingOrigin, StartScraperOptions][] = []

@Injectable()
export class ScrapersService {
    scrapers: Record<ListingOrigin, Scraper>
    /**
     * The current index in the scraper pipeline, is null if pipeline is not running
     * @see {@link scraperPipeline}
     */
    pipelineIndex: number | null = null

    constructor(
        private blocketScraper: BlocketScraper,
        private traderaScraper: TraderaScraper,
        private blippScraper: BlippScraper,
        private sellpyScraper: SellpyScraper,
        private citiboardScraper: CitiboardScraper,
        private shpockScraper: ShpockScraper,
        private bytbilScraper: BytbilScraper,
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ) {
        this.scrapers = {
            Blocket: this.blocketScraper,
            Tradera: this.traderaScraper,
            Blipp: this.blippScraper,
            Sellpy: this.sellpyScraper,
            Citiboard: this.citiboardScraper,
            Shpock: this.shpockScraper,
            Bytbil: this.bytbilScraper,
        }
    }

    logPipeline(total: number, msg: string) {
        console.log(`[${this.pipelineIndex}/${total}] ${msg}`)
    }

    @OnEvent('pipeline.run')
    async handlePipelineRunEvent(payload: RunPipelineEvent) {
        if (this.pipelineIndex != null) {
            // Push to queue if pipeline is already running
            pipelineQueue.push(payload)
            return
        }

        this.pipelineIndex = 0
        const totalScrapers = scraperPipeline.length

        const startScraperNext = async () => {
            const [name, args] = scraperPipeline.shift()
            this.pipelineIndex += 1

            const scraper = this.scrapers[name]

            this.logPipeline(
                totalScrapers,
                `Scraping ${await scraper.quantityToScrape} listings from ${name}...`
            )
            await scraper.start(args)

            this.logPipeline(
                totalScrapers,
                `Successfully scraped ${scraper.listingScraped} from ${name}`
            )

            this.logPipeline(totalScrapers, `Deleting old listings from ${name}...`)
            await scraper.deleteOld()
            scraper.reset()

            this.logPipeline(totalScrapers, `Done!`)
        }

        if (payload.count === -1) {
            // run all
            while (this.pipelineIndex < totalScrapers) {
                await startScraperNext()
            }
        } else {
            while (payload.count > 0 && this.pipelineIndex < totalScrapers) {
                await startScraperNext()
                payload.count -= 1
            }
        }

        this.pipelineIndex = null

        if (pipelineQueue.length) {
            console.log('Running next pipeline in queue...')
            this.eventEmitter.emit('pipeline.run', pipelineQueue.shift())
        } else {
            console.log('Pipeline queue is empty!')
        }
    }

    @Cron('* */45 * * *')
    async startAll(...args: Parameters<Scraper['start']>) {
        for (const [name] of Object.entries(this.scrapers)) {
            scraperPipeline.push([
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
        const scraper: Scraper | undefined = this.scrapers[scraperName]

        if (scraper) {
            scraperPipeline.push([scraperName, options])

            this.eventEmitter.emit('pipeline.run', new RunPipelineEvent())

            return {
                started: true,
                listings_current: await scraper.getListingCount,
                listings_remaining: await scraper.quantityToScrape,
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
            const scraper: Scraper = this.scrapers[key]

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

    async resetAll() {
        for (const scraper of Object.values(this.scrapers)) {
            scraper.reset()
        }
    }
}
