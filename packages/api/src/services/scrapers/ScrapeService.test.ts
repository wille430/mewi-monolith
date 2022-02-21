import ScrapeService from './ScrapeService'
import nodeSchedule from 'node-schedule'

jest.mock('node-schedule', () => {
    const originalModule = jest.requireActual('node-schedule')

    return {
        ...originalModule,
        scheduleJob: jest.fn(),
    }
})

describe('Scraper Service', () => {
    let scrapeService: ScrapeService

    beforeEach(() => {
        scrapeService = new ScrapeService()
    })

    it('should schedule all scrapers', () => {
        scrapeService.schedule()
        expect(nodeSchedule.scheduleJob).toBeCalledTimes(scrapeService.scrapers.length)
    })
})
