import { ScraperTrigger } from '@mewi/prisma'
import { WatchOptions } from '../classes/ListingScraper'

export interface StartScraperOptions {
    triggeredBy: ScraperTrigger
    scrapeCount?: number
    watchOptions?: Partial<WatchOptions>
    onNextEntryPoint?(): any
}
