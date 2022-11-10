import 'reflect-metadata'
import { container } from 'tsyringe'
import { TraderaScraper } from '../../tradera.scraper'

describe('Tradera Scraper', () => {
    let scraper: TraderaScraper

    beforeEach(async () => {
        scraper = container.resolve(TraderaScraper)
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

    describe('#scrape', () => {
        it('should return listings', async () => {
            const { listings } = await scraper.entryPoints[0].scrape(1)

            expect(listings.length).toBeGreaterThan(0)
        })
    })
})
