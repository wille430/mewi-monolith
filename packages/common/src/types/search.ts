import { Watcher } from '@mewi/prisma'
import { ListingSort } from './listingSort'

type Metadata = Watcher['metadata']

export interface ListingSearchFilters extends Partial<Metadata> {
    keyword?: string
    region?: string
    category?: string
    priceRangeGte?: number
    priceRangeLte?: number
    auction?: boolean
    dateGte?: Date
    page?: number
    sort?: ListingSort
}
