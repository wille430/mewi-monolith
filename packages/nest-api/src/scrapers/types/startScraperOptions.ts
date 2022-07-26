import { ScraperTrigger } from '@mewi/prisma'

export interface StartScraperOptions {
    triggeredBy: ScraperTrigger
    scrapeCount?: number
    scrapeType: 'ALL' | 'NEW'
}
