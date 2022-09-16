import { WatchOptions } from '../classes/types/WatchOptions'
import { StartScraperOptions } from './startScraperOptions'

export interface DefaultStartOptions extends Partial<StartScraperOptions> {
    watchOptions: WatchOptions
}
