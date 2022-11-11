import { Category, ListingOrigin } from '@/common/schemas'
import { ListingSort } from '@/common/types'
import type { FindAllListingsDto } from '@/lib/modules/listings/dto/find-all-listing.dto'

export class SearchListingsDto implements FindAllListingsDto {
    limit?: number
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
