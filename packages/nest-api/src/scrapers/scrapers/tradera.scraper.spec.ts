import { Test, TestingModule } from '@nestjs/testing'
import _ from 'lodash'
import { PrismaService } from '../../prisma/prisma.service'
import { TraderaScraper } from './tradera.scraper'

describe('Tradera Scraper', () => {
    let scraper: TraderaScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService, TraderaScraper],
        }).compile()

        scraper = module.get<TraderaScraper>(TraderaScraper)
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

            console.log(categories)

            for (const category of categories) {
                expect(typeof category.href).toBe('string')
            }
        })
    })
})
