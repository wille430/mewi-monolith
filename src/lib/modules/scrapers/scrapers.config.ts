import { ListingOrigin } from '@/common/schemas'

const createConfig = (override: Partial<any> = {}): any => {
    if (override.limit && process.env.NODE_ENV !== 'production') {
        override.limit = Math.min(40, override.limit)
    }

    return {
        interval: 2.5 * 24 * 60 * 60 * 1000,
        listingCount: 7,
        minListings: 1,
        deleteOlderThan: Date.now() - 2 * 30 * 24 * 60 * 60 * 1000,
        limit: process.env.NODE_ENV === 'production' ? 500 : 40,
        useRobots: false,
        scrapeStopAt: 'date',
        ...override,
    }
}

const createFullConfig = () => {
    const config = {
        default: {},
        Bilweb: { scrapeStopAt: 'origin_id' },
        Bytbil: { scrapeStopAt: 'origin_id', limit: 2000 },
        Shpock: { scrapeStopAt: 'origin_id' },
        Tradera: { limit: 1500 },
    }

    for (const key of Object.keys(config)) {
        config[key] = createConfig(config[key])
    }

    return config as any
}

export const scrapersConfig: Partial<Record<ListingOrigin, any>> & {
    default: any
} = createFullConfig()
