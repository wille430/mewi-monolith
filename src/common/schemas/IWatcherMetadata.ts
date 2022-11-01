import { Category } from '../enums/category.enum'
import { ListingOrigin } from '../enums/listing-origin.enum'

export interface IWatcherMetadata {
    keyword?: string
    auction?: boolean
    categories?: Category[]
    origins?: ListingOrigin[]
    priceRangeGte?: number
    priceRangeLte?: number
    region?: string
}
