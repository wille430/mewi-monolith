import faker from '@faker-js/faker'
import Scraper from './Scraper'
import nodeSchedule from 'node-schedule'

jest.mock('node-schedule', () => {
    const originalModule = jest.requireActual('node-schedule')

    return {
        ...originalModule,
        scheduleJob: jest.fn(),
    }
})

describe('Scraper', () => {
    let scraper: Scraper

    beforeEach(() => {
        scraper = new Scraper({
            name: `test-${faker.random.word().toLowerCase()}`,
            baseUrl: 'http://localhost/',
        })
    })

    it('should schedule correctly', () => {
        scraper.schedule()
        expect(nodeSchedule.scheduleJob).toBeCalled()
    })
})
