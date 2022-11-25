import { ScraperStatusReport } from '@/common/types'
import { scraperConfigStub } from './scraper-config.stub'
import { scrapingLogStub } from './scraping-log.stub'

export const scraperStatusReportStub = (): ScraperStatusReport => ({
    listings_current: 1,
    listings_remaining: scraperConfigStub().limit - 1,
    last_scraped: scrapingLogStub().createdAt,
})
