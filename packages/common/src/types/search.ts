import { IWatcher, Category, ListingOrigin } from '../schemas'
import { ListingSort } from './listingSort'

type Metadata = IWatcher['metadata']

export interface ListingSearchFilters extends Partial<Metadata> {
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
