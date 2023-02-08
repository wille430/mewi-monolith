import { IListing, IUserWatcher } from '@/common/schemas'
import type { FindAllListingsReponse } from '@/lib/modules/listings/dto/find-all-listings-response.dto'
import { removeNullValues } from '@/lib/utils/removeNullValues'
import { stringify } from 'query-string'
import { client } from '../index'

export const getWatcherItems = async (watcher: IUserWatcher) => {
    const query = stringify({
        dateGte: watcher.createdAt,
        limit: 5,
        ...removeNullValues(watcher.watcher.metadata),
    })

    return client.get<never, FindAllListingsReponse>('/listings?' + query)
}

export const getLikedListings = () => {
    return client.get<never, IListing[]>('/users/me/likes')
}
