import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { vi } from 'vitest'
import { BytbilScraper } from './bytbil.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { validateListingTest } from '../tests/validate-listing.spec'
import puppeteer from 'puppeteer'

describe('Bytbil Scraper', () => {
    let scraper: BytbilScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, BytbilScraper],
        }).compile()

        scraper = module.get<BytbilScraper>(BytbilScraper)
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#vehicleTypesScrapedMap', () => {
        it('should be a correctly formatted map', () => {
            expect(typeof scraper.vehicleTypesScrapedMap === 'object').toBe(true)

            for (const key in scraper.vehicleTypesScrapedMap) {
                const value = scraper.vehicleTypesScrapedMap[key]
                expect(scraper.vehicleTypes.includes(key)).toBe(true)
                expect(value).toBe(0)
            }
        })
    })

    describe('#getBatch', () => {
        it('should fetch items and return valid array of objects', async () => {
            const scraped = await scraper.getBatch()

            expect(Array.isArray(scraped)).toBe(true)
            expect(scraped.length).toBeGreaterThan(0)

            for (const listing of scraped) {
                validateListingTest(listing, scraper)
            }
        }, 20000)

        it('should be able to fetch subsequently', async () => {
            const resultArray = new Array(2).fill(await scraper.getBatch())

            for (const ele of resultArray) {
                expect(Array.isArray(ele)).toBe(true)
            }
        }, 20000)

        it('should not throw error when fetching 10+ times', async () => {
            puppeteer.launch = vi.fn(() => ({
                newPage: vi.fn().mockResolvedValue({
                    goto: vi.fn(),
                    $$: vi.fn().mockResolvedValue(Array(scraper.limit)),
                }),
                close: vi.fn(),
            })) as any
            scraper.evalParseRawListing = vi.fn((ele) => ele) as any

            for (let i = 0; i < 12; i++) {
                expect(Array.isArray(await scraper.getBatch())).toBe(true)
            }
        })
    })
})
