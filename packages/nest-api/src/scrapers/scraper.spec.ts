import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ListingOrigin, Category } from '@mewi/prisma'
import faker from '@faker-js/faker'
import { vi } from 'vitest'
import { Scraper } from './scraper'
import Scrapers from './scrapers'
import configuration from '../config/configuration'
import { PrismaService } from '../prisma/prisma.service'

describe('scraper', () => {
    let prisma: PrismaService
    let configService: ConfigService
    let scraper: Scraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService],
        }).compile()

        prisma = module.get<PrismaService>(PrismaService)
        configService = module.get<ConfigService>(ConfigService)
        scraper = new Scraper(prisma, configService, ListingOrigin.Blipp, faker.internet.url(), {})
    })

    describe('#parseCategory', () => {
        it('should return Fordon and save cache', () => {
            expect(scraper.parseCategory('frdon')).toEqual(Category.FORDON)
            expect(scraper['stringToCategoryMap']['frdon']).toEqual(Category.FORDON)
        })
    })

    describe('#createId', () => {
        it('should return same if input is the same', () => {
            const string = faker.commerce.product()
            const output = scraper.createId(string)
            expect(scraper.createId(string)).toBe(output)
            expect(scraper.createId(string)).toBe(output)
        })
    })
})

describe('all scrapers', () => {
    let scrapers: Scraper[]
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, ...Scrapers],
        }).compile()

        scrapers = []
        prisma = module.get<PrismaService>(PrismaService)

        for (const scraper of Scrapers) {
            scrapers.push(module.get<Scraper>(scraper as any))
        }
    })

    describe('#start', () => {
        beforeEach(() => {
            prisma.listing.create = vi.fn().mockResolvedValue({})
            prisma.scrapingLog.create = vi.fn().mockResolvedValue({})
            prisma.listing.count = vi.fn().mockResolvedValue(0)
        })

        it('should not run getListings if listingCount is equal to maxEntries', async () => {
            for (const scraper of scrapers) {
                scraper.quantityToScrape = 0
                scraper.getListings = vi.fn().mockResolvedValue([])

                await scraper.start()

                expect(scraper.getListings).not.toBeCalled()
            }
        })

        it('should stop scraping when no more listings were found', async () => {
            for (const scraper of scrapers) {
                scraper.quantityToScrape = 100
                scraper.evalParseRawListing = vi.fn().mockResolvedValue({})
                scraper.parseRawListing = vi.fn().mockResolvedValue({})

                let i = 0
                scraper.getListings = vi.fn(() => {
                    i += 1
                    i = Math.min(i, 10)

                    return new Promise((resolve) => resolve(new Array(10 - i).fill({})))
                })

                await scraper.start()

                expect(scraper.getListings).toBeCalledTimes(10)
            }
        })

        it('should not add more items than maxEntries allow', async () => {
            for (const scraper of scrapers) {
                prisma.listing.create = vi.fn().mockResolvedValue({})

                const quantityToScrape = Math.floor(Math.random() * 100)
                scraper.quantityToScrape = quantityToScrape

                scraper.evalParseRawListing = vi.fn().mockResolvedValue({})
                scraper.parseRawListing = vi.fn().mockResolvedValue({})
                scraper.getListings = vi
                    .fn()
                    .mockResolvedValue(
                        new Array(scraper.maxEntries + Math.floor(Math.random() * 100)).fill({})
                    )

                await scraper.start()

                expect(prisma.listing.create).toBeCalledTimes(quantityToScrape)
            }
        })

        it('should scrape until maxEntries is met, regardless of duplicates', async () => {
            for (const scraper of scrapers) {
                prisma.listing.create = vi.fn().mockResolvedValue({})

                prisma.listing.count = vi.fn<any>(
                    () => new Promise((resolve) => resolve(Math.random() < 0.25 ? 1 : 0))
                )

                const quantityToScrape = Math.floor(Math.random() * 20 + 50)
                scraper.maxEntries = quantityToScrape
                scraper.quantityToScrape = quantityToScrape

                scraper.evalParseRawListing = vi.fn().mockResolvedValue({})
                scraper.parseRawListing = vi.fn().mockResolvedValue({})
                scraper.getListings = vi.fn().mockResolvedValue(new Array(scraper.limit).fill({}))

                await scraper.start()

                expect(scraper.maxEntries).toBe(scraper.listingScraped)
            }
        })
    })
})
