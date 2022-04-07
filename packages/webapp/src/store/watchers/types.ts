import { IListing, JoinedWatcher } from '@wille430/common/types'

export interface WatchersState {
    watchers: JoinedWatcher[]
    isLoading: boolean
    newItems: Record<string, IListing[]>
}

export enum WatchersActionType {
    WATCHERS_ADD = 'watchers/create',
    WATCHERS_FETCH = 'watchers/getAll',
    WATCHERS_DELETE = 'watchers/delete',
    WATHCERS_ERROR = 'watchers/error',
    GET_NEW_ITEMS = 'watchers/new_items',
}
