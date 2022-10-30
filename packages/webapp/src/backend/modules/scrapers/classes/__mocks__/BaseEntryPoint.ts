import faker from '@faker-js/faker'
import { scrapeResultStub } from '../../test/stubs/scrape-result.stub'
import { scrapingLogStub } from '../../test/stubs/scraping-log.stub'

export const BaseEntryPoint = jest.fn().mockReturnValue({
    getMostRecentLog: jest.fn().mockResolvedValue(scrapingLogStub()),
    createContext: jest.fn().mockResolvedValue(null),
    createScrapeResult: jest.fn().mockResolvedValue(null),
    createConfig: jest.fn().mockResolvedValue({
        url: faker.internet.url(),
    }),
    scrape: jest.fn().mockResolvedValue(scrapeResultStub()),
})
