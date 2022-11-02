import type { ScraperTrigger } from '@/common/schemas'
import type { WatchOptions } from '../classes/types/WatchOptions'

export interface StartScraperOptions {
    triggeredBy: ScraperTrigger
    scrapeCount?: number
    watchOptions?: Partial<WatchOptions>
    onNextEntryPoint?(): any
}
