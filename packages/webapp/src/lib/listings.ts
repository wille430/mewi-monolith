import { IListing, IUser } from '@wille430/common'

export const like = (listing: IListing, user: IUser | undefined, arr: IListing[]) => {
    return arr.map((o) => {
        if (o.id === listing.id && user) {
            user.likedListings.push(listing)
        }

        return o
    })
}

export const unlike = (listing: IListing, user: IUser | undefined, arr: IListing[]) => {
    return arr.map((o) => {
        if (o.id === listing.id && user) {
            user.likedListings = user.likedListings.filter((x) => x.id !== listing.id)
        }

        return o
    })
}
