import type { ScraperTrigger } from '@wille430/common'
import type { WatchOptions } from '../classes/types/WatchOptions'

export interface StartScraperOptions {
    triggeredBy: ScraperTrigger
    scrapeCount?: number
    watchOptions?: Partial<WatchOptions>
    onNextEntryPoint?(): any
}
