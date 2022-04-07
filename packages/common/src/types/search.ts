import { Sort } from './sort.enum'

export interface ListingSearchFilters {
    keyword?: string
    regions?: string[] | string
    category?: string
    priceRangeGte?: number
    priceRangeLte?: number
    auction?: boolean
    dateGte?: number
    page?: number
    sort?: Sort
}
