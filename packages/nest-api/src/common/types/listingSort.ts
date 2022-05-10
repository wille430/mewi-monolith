import { Listing, Prisma } from '@mewi/prisma'

export type ListingSort = {
    [key in keyof Listing]: Prisma.SortOrder
}
