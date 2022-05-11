import { ListingSort } from './listingSort'
import { Watcher } from '@mewi/prisma'

type Metadata = Watcher['metadata']

export interface ListingSearchFilters extends Partial<Metadata> {
    keyword?: string
    regions?: string[]
    category?: string
    priceRangeGte?: number
    priceRangeLte?: number
    auction?: boolean
    dateGte?: Date
    page?: number
    sort?: ListingSort
}
