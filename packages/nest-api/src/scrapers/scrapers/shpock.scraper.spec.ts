import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ShpockScraper } from './shpock.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { validateListingTest } from '../tests/validate-listing.spec'

describe('Shpock Scraper', () => {
    let scraper: ShpockScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, ShpockScraper],
        }).compile()

        scraper = module.get<ShpockScraper>(ShpockScraper)
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#getBatch', () => {
        it('should fetch items', async () => {
            const { listings } = await scraper.getBatch()
            expect(Array.isArray(listings)).toBe(true)

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

    describe('#token', () => {
        it('should be a string', async () => {
            const token = await scraper.token
            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)
        }, 20000)
    })
})
