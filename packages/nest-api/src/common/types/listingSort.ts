import { Listing, Prisma } from '@wille430/common'

export type ListingSort = {
    [key in keyof Listing]: Prisma.SortOrder
}
