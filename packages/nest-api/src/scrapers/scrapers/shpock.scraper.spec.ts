import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ShpockScraper } from './shpock.scraper'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { commonScraperTests } from './common.scraper.spec'

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

    describe('#token', () => {
        it('should be a string', async () => {
            const token = await scraper.token
            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)
        }, 20000)
    })
})

commonScraperTests(ShpockScraper)
