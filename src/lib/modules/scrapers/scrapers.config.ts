import { ListingOrigin } from '@/common/schemas'
import { ScraperOptions } from '../common/types/scraperOptions'

const createConfig = (override: Partial<ScraperOptions> = {}): ScraperOptions => {
    return {
        interval: 2.5 * 24 * 60 * 60 * 1000,
        listingCount: 7,
        minListings: 1,
        deleteOlderThan: Date.now() - 2 * 30 * 24 * 60 * 60 * 1000,
        limit: 40,
        useRobots: false,
        scrapeStopAt: 'date',
        ...override,
    }
}

export const scrapersConfig: Partial<Record<ListingOrigin, ScraperOptions>> & {
    default: ScraperOptions
} = {
    default: createConfig(),
    Bilweb: createConfig({ scrapeStopAt: 'origin_id' }),
    Bytbil: createConfig({ scrapeStopAt: 'origin_id' }),
    Shpock: createConfig({ scrapeStopAt: 'origin_id' }),
}
