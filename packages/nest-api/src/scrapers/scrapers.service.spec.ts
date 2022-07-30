import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import _ from 'lodash'
import { vi } from 'vitest'
import { ScraperStatus } from '@wille430/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ScrapersService } from './scrapers.service'
import configuration from '../config/configuration'
import { PrismaService } from '../prisma/prisma.service'
import { BaseListingScraper } from './classes/BaseListingScraper'
import faker from '@faker-js/faker'
import { createListing } from '@/factories/createListing'
import { mockedScrapers } from './scrapers/__mocks__/mockedScrapers'
import Scrapers from './scrapers'
import { ScrapedListing } from './classes/types/ScrapedListing'

describe('scraper', () => {
    let scrapersService: ScrapersService
    let scrapers: BaseListingScraper[] = []
    let prisma: PrismaService

    let scrapersAsync = mockedScrapers
    let resolvedScrapers: typeof Scrapers

    beforeEach(async () => {
        resolvedScrapers = await Promise.all(scrapersAsync.map(async (x) => await x))

        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [
                ConfigService,
                PrismaService,
                ScrapersService,
                EventEmitter2,
                ...resolvedScrapers,
            ],
        }).compile()

        scrapersService = module.get<ScrapersService>(ScrapersService)
        prisma = module.get<PrismaService>(PrismaService)

        scrapers = []

        for (const scraper of resolvedScrapers) {
            let temp = module.get<typeof scraper>(scraper as any) as any as BaseListingScraper
            scrapers.push(temp)
        }
    })

    it('should be defined', () => {
        expect(scrapersService).toBeTruthy()
    })

    describe.each(
        Array(scrapersAsync.length)
            .fill(null)
            .map((o, i) => [i, Scrapers[i].name])
    )('#start (%i) %s', (index, name) => {
        let scraper: BaseListingScraper
        let scraper2: BaseListingScraper
        const getListingsDelay = 500
        let listings: ScrapedListing[]

        beforeEach(async () => {
            scraper = scrapers[index]
            scraper2 = _.sample(scrapers.filter((x) => x.origin !== scraper.origin))

            await scraper.initialize()

            listings = new Array(scraper.limit).fill(null).map((o, i) =>
                createListing({
                    origin_id: scraper.createId(faker.random.alpha(16)),
                    origin: scraper.origin,
                    date: new Date(Date.now() - 2 * 60 * 1000 * i),
                })
            )

            scraper.entryPoints.forEach((entryPoint) => {
                entryPoint.scrape = vi.fn().mockResolvedValue({
                    listings,
                    page: 1,
                    continue: false,
                })
                entryPoint.getMostRecentLog = vi.fn().mockResolvedValue(undefined)
            })

            scrapersService.statusOf = vi.fn().mockResolvedValue({})

            prisma.listing.deleteMany = vi.fn()
            prisma.listing.createMany = vi.fn().mockResolvedValue({
                count: listings.length,
            })
            prisma.scrapingLog.create = vi.fn()
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

        it('should scrape until total pages is reached', async () => {
            const totalPages = Math.floor(Math.random() * 5) + 2

            scraper.getTotalPages = vi.fn(() => totalPages)

            scraper.entryPoints.forEach((entryPoint) => {
                entryPoint.scrape = vi.fn((page) =>
                    Promise.resolve({
                        listings,
                        page,
                        continue: page < totalPages,
                    })
                )
            })

            await scraper.start()

            for (const entryPoint of scraper.entryPoints) {
                expect(entryPoint.scrape).toBeCalledTimes(Math.max(totalPages, 1))
            }
        })
    })
})
