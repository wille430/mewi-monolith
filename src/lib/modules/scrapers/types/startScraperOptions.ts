import type { ScraperTrigger } from '@/common/schemas'

export interface StartScraperOptions {
    triggeredBy: ScraperTrigger
    scrapeCount?: number
    onNextEntryPoint?(): any
}
