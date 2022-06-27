import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SellpyScraper } from './sellpy.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { validateListingTest } from '../tests/validate-listing.spec'

describe('Sellpy Scraper', () => {
    let scraper: SellpyScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, SellpyScraper],
        }).compile()

        scraper = module.get<SellpyScraper>(SellpyScraper)
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#getListings', () => {
        it('should fetch items and return valid array of objects', async () => {
            const scraped = await scraper.getListings()

            expect(Array.isArray(scraped)).toBe(true)
            expect(scraped.length).toBeGreaterThan(0)

            for (const listing of scraped) {
                validateListingTest(listing, scraper)
            }
        }, 20000)

        it('should be able to fetch subsequently', async () => {
            const resultArray = new Array(2).fill(await scraper.getListings())

            for (const ele of resultArray) {
                expect(Array.isArray(ele)).toBe(true)
            }
        }, 20000)
    })
})
