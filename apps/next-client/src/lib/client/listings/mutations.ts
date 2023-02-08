import { IUser } from '@/common/schemas'
import { client, MutationArgs } from '../index'
import { CURRENT_USER_SWR_KEY } from '../users/swr-keys'

export const setLikeListing = (listingId: string, value: boolean): MutationArgs => {
    const endpoint = value ? 'like' : 'unlike'
    const updateFn = async (user: IUser) => {
        await client.put(`/listings/${listingId}/${endpoint}`)

        return user
    }

    const optimisticData = async (user: IUser | undefined) => {
        return {
            ...user,
            likedListings: [...(user?.likedListings ?? []), listingId],
        }
    }

    return [
        CURRENT_USER_SWR_KEY,
        updateFn,
        {
            optimisticData,
        },
    ]
}
