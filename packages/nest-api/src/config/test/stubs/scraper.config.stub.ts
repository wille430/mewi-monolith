import { ScraperConfig } from '@/config/scraper.config'

export const scraperConfigStub = (): ScraperConfig => ({
    default: {
        deleteOlderThan: 99999,
        limit: 20,
    },
})
