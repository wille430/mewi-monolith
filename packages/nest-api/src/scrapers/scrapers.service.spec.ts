import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import _ from 'lodash'
import { vi } from 'vitest'
import { ScraperStatus } from '@wille430/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ScrapersService } from './scrapers.service'
import scraperServices from './scrapers'
import { Scraper } from './scraper'
import configuration from '../config/configuration'
import { PrismaService } from '../prisma/prisma.service'
import { ListingScraper } from './classes/ListingScraper'

describe('scraper', () => {
    let scrapersService: ScrapersService
    let scrapers: Scraper[] = []

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [
                ConfigService,
                PrismaService,
                ScrapersService,
                EventEmitter2,
                ...scraperServices,
            ],
        }).compile()

        scrapersService = module.get<ScrapersService>(ScrapersService)

        scrapers = []

        for (const scraper of scraperServices) {
            scrapers.push(module.get<typeof scraper>(scraper as any) as any as Scraper)
        }
    })

    it('should be defined', () => {
        expect(scrapersService).toBeTruthy()
    })

    describe('#start', () => {
        let scraper: ListingScraper
        let scraper2: ListingScraper
        const getListingsDelay = 500

        beforeEach(() => {
            scraper = _.sample(scrapers)
            scraper2 = _.sample(scrapers.filter((x) => x.origin !== scraper.origin))

            scraper.getBatch = vi.fn(
                async () =>
                    await new Promise((resolve) =>
                        setTimeout(() => resolve(new Array(scraper.limit)), getListingsDelay)
                    )
            )
            scrapersService.statusOf = vi.fn().mockResolvedValue({})
        })

        it('should update status correctly', async () => {
            // Before scraping
            expect(scraper.status).toBe(ScraperStatus.IDLE)

            await scrapersService.start(scraper.origin)

            // Directly before scraping
            expect(scraper.status).toBe(ScraperStatus.QUEUED)
            expect(scrapersService.scraperPipeline[0][0]).toBe(scraper.origin)

            // During scraping
            setTimeout(() => {
                expect(scraper.status).toBe(ScraperStatus.SCRAPING)
                expect(scrapersService.scraperPipeline[0]).not.toBeTruthy()
            }, getListingsDelay / 2)

            // After scraping
            setTimeout(() => {
                expect(scraper.status).toBe(ScraperStatus.IDLE)
                expect(scrapersService.scraperPipeline[0]).not.toBeTruthy()
            }, getListingsDelay)
        })

        it('should allow queueing', async () => {
            // Before scraping
            expect(scraper.status).toBe(ScraperStatus.IDLE)
            expect(scraper2.status).toBe(ScraperStatus.IDLE)

            await scrapersService.start(scraper.origin)
            await scrapersService.start(scraper2.origin)

            // Directly before scraping
            expect(scraper.status).toBe(ScraperStatus.QUEUED)
            expect(scrapersService.scraperPipeline[0][0]).toBe(scraper.origin)

            expect(scraper2.status).toBe(ScraperStatus.QUEUED)
            expect(scrapersService.scraperPipeline[1][0]).toBe(scraper2.origin)

            // During scraping of scraper 1
            setTimeout(() => {
                expect(scraper.status).toBe(ScraperStatus.SCRAPING)
                expect(scrapersService.scraperPipeline[0]).not.toBeTruthy()

                expect(scraper2.status).toBe(ScraperStatus.QUEUED)
                expect(scrapersService.scraperPipeline[0][0]).toBe(scraper2.origin)
            }, getListingsDelay / 2)

            // After scraping of scraper 1
            setTimeout(() => {
                expect(scraper.status).toBe(ScraperStatus.IDLE)
                expect(scrapersService.scraperPipeline[0]).not.toBeTruthy()

                expect(scraper2.status).toBe(ScraperStatus.SCRAPING)
                expect(scrapersService.scraperPipeline[0][0]).not.toBeTruthy()
            }, getListingsDelay + 10)
        })
    })
})
