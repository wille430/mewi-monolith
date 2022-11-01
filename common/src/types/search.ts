import type { ListingSort } from './listingSort'
import type { IWatcher, Category, ListingOrigin } from '../schemas'

type Metadata = IWatcher['metadata']

export class ListingSearchFilters implements Partial<Metadata> {
    keyword?: string
    region?: string
    categories?: Category[]
    priceRangeGte?: number
    priceRangeLte?: number
    auction?: boolean
    dateGte?: Date
    page?: number
    sort?: ListingSort
    origins?: ListingOrigin[]
}
