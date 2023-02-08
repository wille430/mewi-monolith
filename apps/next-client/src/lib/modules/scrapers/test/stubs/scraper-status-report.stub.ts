import { ScraperStatusReport } from '@/common/types'
import { scrapingLogStub } from './scraping-log.stub'

export const scraperStatusReportStub = (): ScraperStatusReport => ({
    listings_current: 1,
    listings_remaining: 9,
    last_scraped: scrapingLogStub().createdAt,
})
