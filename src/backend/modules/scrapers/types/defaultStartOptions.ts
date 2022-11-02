import type { StartScraperOptions } from './startScraperOptions'
import type { WatchOptions } from '../classes/types/WatchOptions'

export interface DefaultStartOptions extends Partial<StartScraperOptions> {
    watchOptions: WatchOptions
}
