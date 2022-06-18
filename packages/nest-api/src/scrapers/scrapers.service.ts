import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ListingOrigin, Prisma, ScraperTrigger } from '@mewi/prisma'
import { ScraperStatus, ScraperStatusReport } from '@wille430/common'
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

@Injectable()
export class ScrapersService {
    scrapers: Record<ListingOrigin, Scraper>
    /**
     * The current index in the scraper pipeline, is null if pipeline is not running
     * @see {@link scraperPipeline}
     */
    pipelineIndex: number | null = null
    startScraperAfterMs = 60 * 60 * 1000
    pipelineQueue: RunPipelineEvent[] = []
    scraperPipeline: [ListingOrigin, StartScraperOptions][] = []

    constructor(
        @Inject(BlocketScraper) private blocketScraper: BlocketScraper,
        @Inject(TraderaScraper) private traderaScraper: TraderaScraper,
        @Inject(BlippScraper) private blippScraper: BlippScraper,
        @Inject(SellpyScraper) private sellpyScraper: SellpyScraper,
        @Inject(CitiboardScraper) private citiboardScraper: CitiboardScraper,
        @Inject(ShpockScraper) private shpockScraper: ShpockScraper,
        @Inject(BytbilScraper) private bytbilScraper: BytbilScraper,
        @Inject(PrismaService) private prisma: PrismaService,
        @Inject(EventEmitter2) private eventEmitter: EventEmitter2
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
            this.pipelineQueue.push(payload)
            return
        }

        this.pipelineIndex = 0
        const totalScrapers = this.scraperPipeline.length

        const startScraperNext = async () => {
            const [name, args] = this.scraperPipeline.shift()
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

            if (this.scraperPipeline.find((x) => x[0] === scraper.name))
                scraper.status = ScraperStatus.QUEUED

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

        if (this.pipelineQueue.length) {
            console.log('Running next pipeline in queue...')
            this.eventEmitter.emit('pipeline.run', this.pipelineQueue.shift())
        } else {
            console.log('Pipeline queue is empty!')
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
    ): Promise<ScraperStatusReport> {
        const scraper: Scraper | undefined = this.scrapers[scraperName]

        if (scraper) {
            this.scraperPipeline.push([scraperName, options])
            if (scraper.status !== ScraperStatus.SCRAPING) scraper.status = ScraperStatus.QUEUED

            this.eventEmitter.emit('pipeline.run', new RunPipelineEvent())

            const status = await this.statusOf(scraperName)
            status.started = true

            return status
        } else {
            throw new NotFoundException({
                statusCode: 404,
                message: [`no scraper named ${scraperName}`],
                error: 'Not Found',
            })
        }
    }

    @Cron('* */5 * * *')
    async conditionalScrape() {
        const lastScrape = await this.prisma.scrapingLog.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        })

        if (!lastScrape) return

        if (Date.now() - lastScrape.createdAt.getTime() > this.startScraperAfterMs)
            await this.startAll()
    }

    async status(): Promise<Record<ListingOrigin, ScraperStatusReport>> {
        const allScraperStatus: Partial<ReturnType<typeof this.status>> = {}

        for (const key of Object.keys(ListingOrigin)) {
            allScraperStatus[key] = await this.statusOf(key as ListingOrigin)
        }

        return allScraperStatus as ReturnType<typeof this.status>
    }

    async statusOf(target: ListingOrigin): Promise<ScraperStatusReport> {
        const scraper: Scraper = this.scrapers[target]

        const listingCount = await this.prisma.listing.count({
            where: {
                origin: target,
            },
        })

        return {
            started: scraper.isScraping,
            listings_current: listingCount,
            status: scraper.status,
            listings_remaining: scraper.maxEntries - listingCount,
            last_scraped: await this.prisma.scrapingLog
                .findFirst({
                    where: {
                        target: scraper.name,
                    },
                    take: 1,
                    orderBy: {
                        createdAt: 'desc',
                    },
                })
                .then((o) => o?.createdAt ?? undefined),
        }
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
