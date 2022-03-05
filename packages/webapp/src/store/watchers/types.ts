import { ItemData, JoinedWatcher } from '@mewi/types'

export interface WatchersState {
    watchers: JoinedWatcher[]
    isLoading: boolean
    newItems: Record<string, ItemData[]>
}

export enum WatchersActionType {
    WATCHERS_ADD = 'watchers/create',
    WATCHERS_FETCH = 'watchers/getAll',
    WATCHERS_DELETE = 'watchers/delete',
    WATHCERS_ERROR = 'watchers/error',
    GET_NEW_ITEMS = 'watchers/new_items',
}
