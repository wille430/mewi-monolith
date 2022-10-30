import puppeteer from 'puppeteer'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { BytbilScraper } from '../../bytbil.scraper'

describe('Bytbil Scraper', () => {
    let scraper: BytbilScraper

    beforeEach(async () => {
        scraper = container.resolve(BytbilScraper)
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
