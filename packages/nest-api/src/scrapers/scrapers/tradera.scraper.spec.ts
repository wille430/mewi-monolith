import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TraderaScraper } from './tradera.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { validateListingTest } from '../tests/validate-listing.spec'

describe('Tradera Scraper', () => {
    let scraper: TraderaScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, TraderaScraper],
        }).compile()

        scraper = module.get<TraderaScraper>(TraderaScraper)
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#getBatch', () => {
        it('should fetch items and return valid array of objects', async () => {
            const { listings } = await scraper.getBatch()

            expect(Array.isArray(listings)).toBe(true)
            expect(listings.length).toBeGreaterThan(0)

            for (const listing of listings) {
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
