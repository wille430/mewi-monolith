import { Category } from './ListingCategory'
import { ListingOrigin } from './ListingOrigin'

export interface WatcherMetadataDto {
    keyword?: string
    auction?: boolean
    categories?: Category[]
    origins?: ListingOrigin[]
    priceRangeGte?: number
    priceRangeLte?: number
    region?: string
}
