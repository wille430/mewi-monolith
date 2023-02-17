import {Category} from "./ListingCategory"
import {ListingOrigin} from "./ListingOrigin"
import {IEntity} from "./IEntity"

interface IWatcherMetadata {
    keyword?: string
    auction?: boolean
    categories?: Category[]
    origins?: ListingOrigin[]
    priceRangeGte?: number
    priceRangeLte?: number
    region?: string
}

export interface WatcherDto extends IEntity {
    id: string
    metadata: IWatcherMetadata
    notifiedAt?: Date
}