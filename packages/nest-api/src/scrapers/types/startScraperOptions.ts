import { ScraperTrigger } from '@mewi/prisma'
import { WatchOptions } from '../classes/types/WatchOptions'

export interface StartScraperOptions {
    triggeredBy: ScraperTrigger
    scrapeCount?: number
    watchOptions?: Partial<WatchOptions>
    onNextEntryPoint?(): any
}
