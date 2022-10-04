import { AppModule } from '@/app.module'
import { ListingsRepository } from '@/listings/listings.repository'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import _ from 'lodash'
import { ScrapingLogsRepository } from '../../../scraping-logs.repository'
import { TraderaScraper } from '../../tradera.scraper'

describe('Tradera Scraper', () => {
    let scraper: TraderaScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        scraper = new TraderaScraper(
            module.get<ListingsRepository>(ListingsRepository),
            module.get<ScrapingLogsRepository>(ScrapingLogsRepository),
            module.get<ConfigService>(ConfigService)
        )
        scraper.limit = 10
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#getCategories', () => {
        it('should succeed', async () => {
            const categories = await scraper.getCategories()

            expect(categories).toBeTruthy()
            expect(Array.isArray(categories)).toBe(true)
            expect(categories.length).toBeGreaterThan(0)

            for (const category of categories) {
                expect(typeof category.href).toBe('string')
            }
        })
    })
})
