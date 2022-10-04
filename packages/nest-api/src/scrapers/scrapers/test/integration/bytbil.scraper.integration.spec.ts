import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { BytbilScraper } from '../../bytbil.scraper'
import * as puppeteer from 'puppeteer'
import { ListingsRepository } from '@/listings/listings.repository'
import { ScrapingLogsRepository } from '../../../scraping-logs.repository'
import { AppModule } from '@/app.module'

describe('Bytbil Scraper', () => {
    let scraper: BytbilScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        scraper = new BytbilScraper(
            module.get<ListingsRepository>(ListingsRepository),
            module.get<ScrapingLogsRepository>(ScrapingLogsRepository),
            module.get<ConfigService>(ConfigService)
        )
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#scrape', () => {
        it('should not throw error when fetching 10+ times', async () => {
            jest.spyOn(puppeteer, 'launch').mockReturnValue({
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
