import type { ScraperStatusReport } from '@wille430/common'
import { ScraperStatus } from '@wille430/common'
import { scrapingLogStub } from './scraping-log.stub'
import { scraperConfigStub } from '@/config/test/stubs/scraper.config.stub'

export const scraperStatusReportStub = (): ScraperStatusReport => ({
    listings_current: 1,
    listings_remaining: (scraperConfigStub().default.limit ?? 0) - 1,
    started: false,
    status: ScraperStatus.IDLE,
    last_scraped: scrapingLogStub().createdAt,
})
