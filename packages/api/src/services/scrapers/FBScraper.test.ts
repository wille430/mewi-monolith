import FBScraper from './FBScraper'

describe('FB Scraper', () => {
    let scraper: FBScraper

    beforeEach(() => {
        scraper = new FBScraper()
    })

    it('can get all categories', async () => {
        const cats = await scraper.categories()

        expect(cats.length).toBeGreaterThan(0)
        expect(cats).toBeInstanceOf(Array)

        for (const cat in cats) {
            expect(cat).toBeInstanceOf(String)
        }
    })
})
