import type {WatcherDto, Category, ListingOrigin} from '@mewi/models'
import {ListingSort} from "@mewi/models"

type Metadata = WatcherDto['metadata']

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
