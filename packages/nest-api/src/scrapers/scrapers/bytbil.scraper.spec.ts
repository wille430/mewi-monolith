import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { vi } from 'vitest'
import { BytbilScraper } from './bytbil.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { validateListingTest } from '../tests/validate-listing.spec'
import puppeteer from 'puppeteer'
import { commonScraperTests } from './common.scraper.spec'

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

    describe('#scrape', () => {
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
                expect(
                    Array.isArray(
                        await scraper.entryPoints[0].scrape(i + 1).then((res) => res.listings)
                    )
                ).toBe(true)
            }
        })
    })
})
