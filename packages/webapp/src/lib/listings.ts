import { Listing } from '@mewi/prisma/index-browser'

export const like = (listingId: string, userId: string | undefined, arr: Listing[]) => {
    return arr.map((o) => {
        if (o.id === listingId && userId) {
            o.likedByUserIDs.push(userId)
        }

        return o
    })
}

export const unlike = (listingId: string, userId: string | undefined, arr: Listing[]) => {
    return arr.map((o) => {
        if (o.id === listingId) {
            o.likedByUserIDs = o.likedByUserIDs.filter((x) => x !== userId)
        }

        return o
    })
}
