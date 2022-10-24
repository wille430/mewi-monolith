import type { IListing, IUser } from '@wille430/common'

export const likeWith = (
    listing: IListing,
    user: IUser | undefined,
    arr: IListing[],
    callback: (listings: IListing[], listing: IListing) => IListing[]
): IListing[] => {
    arr.forEach((l) => {
        if (listing.id === listing.id && user) {
            user.likedListings = callback(user.likedListings, l)
        }
    })

    return user?.likedListings ?? []
}

export const like = (listing: IListing, user: IUser | undefined, arr: IListing[]) =>
    likeWith(listing, user, arr, (arr, listing) => [...arr, listing])

export const unlike = (listing: IListing, user: IUser | undefined, arr: IListing[]) =>
    likeWith(listing, user, arr, (arr, listing) => arr.filter((x) => x.id !== listing.id))
