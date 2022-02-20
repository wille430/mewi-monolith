import BlippScraper from './BlippScraper'
import EndDate from '../EndDate'
import ItemsService from '../ItemsService'

describe('Blipp Scraper', () => {
    let scraper: BlippScraper

    beforeEach(() => {
        scraper = new BlippScraper(1000)
    })

    it('should return number of pages', async () => {
        const pageCount = await scraper.numberOfPages()

        expect(typeof pageCount).toBe('number')
        expect(pageCount).toBeGreaterThan(0)
    }, 30000)

    it('should return aticles on page', async () => {
        const pageNumber = 1
        const items = await scraper.getArticlesOnPage(pageNumber)

        expect(items.length).toBeGreaterThan(0)

        for (const item of items) {
            expect(typeof item._id).toBe('string')
            expect(typeof item.title).toBe('string')
            expect(item.imageUrl).toBeInstanceOf(Array)
            expect(typeof item.isAuction).toBe('boolean')
            expect(typeof item.redirectUrl).toBe('string')
            expect(typeof item.region).toBe('string')
            expect(typeof item.origin).toBe('string')
            expect(item.category).toBeInstanceOf(Array)
            expect(item.category).toContain('fordon')
        }
    }, 30000)

    let mockGetNextArticles

    it('should iterate through all pages', async () => {
        const itemsPerPage = 9
        const pages = 32
        let currentPage = 1

        mockGetNextArticles = jest.fn(async () => {
            if (currentPage >= pages) {
                return []
            }

            currentPage += 1
            return await Promise.resolve(Array(itemsPerPage).fill({ date: Date.now() }))
        })

        const mockSetEndDateFor = jest
            .spyOn(EndDate, 'setEndDateFor')
            .mockImplementation(() => undefined)
        const mockAddItems = jest.spyOn(ItemsService, 'addItems').mockImplementation(() => {
            return Promise.resolve(itemsPerPage)
        })

        scraper.getNextArticles = mockGetNextArticles
        scraper.canCrawl = true
        scraper.checkRobots = jest.fn()
        scraper.numberOfPages = jest.fn(async () => {
            return await Promise.resolve(pages)
        })

        await scraper.start()

        expect(mockAddItems).toBeCalledTimes(pages)
        expect(mockSetEndDateFor).toBeCalledTimes(1)
        expect(mockGetNextArticles).toBeCalledTimes(pages)
    }, 10000)
})
