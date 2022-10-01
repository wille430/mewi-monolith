import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BytbilScraper } from './bytbil.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import * as puppeteer from 'puppeteer'

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
            jest.spyOn(puppeteer, 'launch').mockImplementation({
                newPage: jest.fn().mockResolvedValue({
                    goto: jest.fn(),
                    $$: jest.fn().mockResolvedValue(Array(scraper.limit)),
                }),
                close: jest.fn(),
            } as any)
            scraper.evalParseRawListing = jest.fn((ele) => ele) as any

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
