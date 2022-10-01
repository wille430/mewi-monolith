import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import _ from 'lodash'
import { ListingOrigin, ScraperStatus } from '@wille430/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ScrapersService } from './scrapers.service'
import configuration from '../config/configuration'
import { BaseListingScraper } from './classes/BaseListingScraper'
import faker from '@faker-js/faker'
import { createListing } from '@/factories/createListing'
import { ScrapedListing } from './classes/types/ScrapedListing'
import { ListingScraperMock } from './scrapers/__mocks__/ListingScraper'
import { MAX_SCRAPE_DURATION } from './classes/__mocks__/EntryPoint'
import { randomSample } from '@mewi/test-utils'
import { ListingsRepository } from '@/listings/listings.repository'

jest.mock('../listings/listings.repository')

describe('ScrapersService', () => {
    let scrapersService: ScrapersService
    let scrapers: BaseListingScraper[] = []
    let listingsRepository: ListingsRepository
    let configService: ConfigService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, ListingsRepository, ScrapersService, EventEmitter2],
        }).compile()

        scrapersService = module.get<ScrapersService>(ScrapersService)
        listingsRepository = module.get<ListingsRepository>(ListingsRepository)
        configService = module.get<ConfigService>(ConfigService)

        const nullArr = new Array(Object.values(ListingOrigin).length).fill(null)
        const scrapersMap = nullArr.map((_, index) => {
            const origin = Object.values(ListingOrigin)[index]
            const scraper = new ListingScraperMock(listingsRepository, configService)
            scraper.origin = origin
            return scraper
        })
        const scrapersHash = scrapersMap.reduce((prev, curr) => {
            prev[curr.origin] = curr as any
            return prev
        }, {} as typeof scrapersService.scrapers)

        scrapers = scrapersMap

        scrapersService.scrapers = scrapersHash

        jest.useFakeTimers()
    })

    it('should be defined', () => {
        expect(scrapersService).toBeTruthy()
    })

    describe('#start', () => {
        let scraper: BaseListingScraper
        const getListingsDelay = MAX_SCRAPE_DURATION + 50
        let listings: ScrapedListing[]

        beforeEach(async () => {
            scraper = _.sample(Object.values(scrapersService.scrapers))!
            await scraper.initialize()

            listings = await Promise.all(
                new Array(scraper.limit).fill(null).map(
                    (o, i) =>
                        createListing({
                            origin_id: scraper.createId(faker.random.alpha(16)),
                            origin: scraper.origin,
                            date: new Date(Date.now() - 2 * 60 * 1000 * i),
                        }) as Promise<ScrapedListing>
                )
            )

            scrapersService.statusOf = jest.fn().mockResolvedValue({})
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
            }, getListingsDelay + 200)
        })

        it('should remove scraper from queue after each scraper resolves', async () => {
            const scrapersToQueue = randomSample(scrapers, 2)

            for (const scraper of scrapersToQueue) {
                await scrapersService.start(scraper.origin)
                expect(scrapersService.scraperPipeline.at(-1)?.at(0)).toBe(scraper.origin)
            }

            setTimeout(() => {
                expect(scrapersService.scraperPipeline.length).toBe(0)
            }, getListingsDelay * scrapersToQueue.length)
        })

        it('should have idle status when in queue and not running', async () => {
            const scrapersToQueue = randomSample(scrapers, 2)

            for (const scraper of scrapersToQueue) {
                await scrapersService.start(scraper.origin)
            }

            for (const scraper of scrapersToQueue) {
                expect(scraper.status).toBe(ScraperStatus.QUEUED)
            }
        })

        it('should scrape until total pages is reached', async () => {
            const totalPages = Math.floor(Math.random() * 5) + 2

            scraper.getTotalPages = jest.fn(() => totalPages)

            scraper.entryPoints.forEach((entryPoint) => {
                entryPoint.scrape = jest.fn((page) =>
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
