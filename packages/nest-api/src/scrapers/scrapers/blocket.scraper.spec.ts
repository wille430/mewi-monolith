import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BlocketScraper } from './blocket.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { validateListingTest } from '../tests/validate-listing.spec'

describe('Blipp Scraper', () => {
    let scraper: BlocketScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, BlocketScraper],
        }).compile()

        scraper = module.get<BlocketScraper>(BlocketScraper)
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#getBatch', () => {
        it('should fetch items and return valid array of objects', async () => {
            const { listings: scraped } = await scraper.getBatch()

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
