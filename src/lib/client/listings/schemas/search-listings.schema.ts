import { Category, ListingOrigin } from '@/common/schemas'
import { ListingSort } from '@/common/types'
import type { FindAllListingsDto } from '@/lib/modules/listings/dto/find-all-listing.dto'
import { array, boolean, date, mixed, number, object, string } from 'yup'

export const searchListingsSchema = object().shape<Record<keyof FindAllListingsDto, any>>({
    auction: boolean(),
    categories: array(mixed().oneOf(Object.values(Category) as Category[])),
    dateGte: date(),
    keyword: string(),
    limit: number().min(0),
    origins: array(mixed().oneOf(Object.values(ListingOrigin) as ListingOrigin[])),
    page: number().min(1),
    priceRangeGte: number(),
    priceRangeLte: number(),
    region: string(),
    sort: mixed().oneOf(Object.values(ListingSort)),
})
