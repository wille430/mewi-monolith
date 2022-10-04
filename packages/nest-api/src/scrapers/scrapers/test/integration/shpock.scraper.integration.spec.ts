import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { ShpockScraper } from '../../shpock.scraper'
import { ScrapingLogsRepository } from '../../../scraping-logs.repository'
import { ListingsRepository } from '@/listings/listings.repository'
import { AppModule } from '@/app.module'

describe('Shpock Scraper', () => {
    let scraper: ShpockScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        scraper = new ShpockScraper(
            module.get<ListingsRepository>(ListingsRepository),
            module.get<ScrapingLogsRepository>(ScrapingLogsRepository),
            module.get<ConfigService>(ConfigService)
        )
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
