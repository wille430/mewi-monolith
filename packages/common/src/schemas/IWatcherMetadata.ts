import { ListingOrigin } from './enums/listing-origin.enum'

export interface IWatcherMetadata {
    keyword?: string
    auction?: boolean
    categories?: string[]
    origins?: ListingOrigin[]
    priceRangeGte?: number
    priceRangeLte?: number
    region?: string
}
