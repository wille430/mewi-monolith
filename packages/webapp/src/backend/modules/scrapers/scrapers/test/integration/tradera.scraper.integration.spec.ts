import { ConfigService } from '@nestjs/config'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ScrapingLogsRepository } from '../../../scraping-logs.repository'
import { TraderaScraper } from '../../tradera.scraper'
import { ListingsRepository } from '@/listings/listings.repository'
import { AppModule } from '@/app.module'

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
