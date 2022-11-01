import 'reflect-metadata'
import { container } from 'tsyringe'
import { ShpockScraper } from '../../shpock.scraper'

describe('Shpock Scraper', () => {
    let scraper: ShpockScraper

    beforeEach(async () => {
        scraper = container.resolve(ShpockScraper)
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
