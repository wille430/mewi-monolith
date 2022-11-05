import { IListing, IUserWatcher } from '@/common/schemas'
import { removeNullValues } from '@/lib/utils/removeNullValues'
import { stringify } from 'query-string'
import { client } from '..'

export const getWatcherItems = (watcher: IUserWatcher) => {
    return client.get<never, IListing[]>(
        '/listings?' +
            stringify({
                dateGte: watcher.createdAt,
                limit: 5,
                ...removeNullValues(watcher.watcher.metadata),
            })
    )
}

export const getLikedListings = () => {
    return client.get<never, IListing[]>('/users/me/likes')
}
