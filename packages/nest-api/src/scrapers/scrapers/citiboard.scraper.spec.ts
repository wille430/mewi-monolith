import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CitiboardScraper } from './citiboard.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'

describe('Citiboard Scraper', () => {
    let scraper: CitiboardScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, CitiboardScraper],
        }).compile()

        scraper = module.get<CitiboardScraper>(CitiboardScraper)
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#getListings', () => {
        it('should fetch items', async () => {
            expect(Array.isArray(await scraper.getListings())).toBe(true)
        }, 20000)

        it('should be able to fetch subsequently', async () => {
            const resultArray = new Array(2).fill(await scraper.getListings())

            for (const ele of resultArray) {
                expect(Array.isArray(ele)).toBe(true)
            }
        }, 20000)
    })
})
