import { IListing, IPopulatedWatcher } from '@wille430/common'

export interface WatchersState {
    watchers: IPopulatedWatcher[]
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
