import BlippScraper from './BlippScraper'

describe('Blipp Scraper', () => {
    let scraper: BlippScraper

    beforeEach(() => {
        scraper = new BlippScraper()
    })

    it('should return number of pages', async () => {
        const pageCount = await scraper.numberOfPages()

        expect(typeof pageCount).toBe('number')
        expect(pageCount).toBeGreaterThan(0)
    }, 10000)
})
