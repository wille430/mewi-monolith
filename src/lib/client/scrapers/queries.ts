import { ListingOrigin } from '@/common/schemas'
import { ScraperStatusReport } from '@/common/types'
import { client } from '..'

export const getScrapersStatus = () => {
    return client.get<never, Record<ListingOrigin, ScraperStatusReport>>('/scrapers/status')
}
