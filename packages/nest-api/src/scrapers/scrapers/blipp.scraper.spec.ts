import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BlippScraper } from './blipp.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { validateListingTest } from '../tests/validate-listing.spec'

describe('Blipp Scraper', () => {
    let scraper: BlippScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, BlippScraper],
        }).compile()

        scraper = module.get<BlippScraper>(BlippScraper)
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#getListings', () => {
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
    })
})
