import { ScraperOptions } from '@/common/types/scraperOptions'
import { registerAs } from '@nestjs/config'
import { ListingOrigin } from '@wille430/common'

const isProduction = process.env.NODE_ENV === 'production'

type ScraperConfig = Partial<Record<ListingOrigin, ScraperOptions>> & {
    default: ScraperOptions
}

export default registerAs('scraper', (): ScraperConfig => {
    if (isProduction) {
        return {
            Blocket: {
                limit: 2000,
            },
            Tradera: {
                limit: 500,
            },
            Blipp: {
                limit: 200,
            },
            Sellpy: {
                limit: 500,
            },
            default: {
                limit: 200,
            },
        }
    } else {
        return {
            default: {
                limit: 40,
            },
        }
    }
})