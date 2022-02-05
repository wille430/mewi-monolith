import { PublicWatcher } from '@mewi/types'

export interface WatchersState {
    watchers: PublicWatcher[]
    isLoading: boolean
}

export enum WatchersActionType {
    WATCHERS_ADD = 'watchers/create',
    WATCHERS_FETCH = 'watchers/getAll',
    WATCHERS_DELETE = 'watchers/delete',
    WATHCERS_ERROR = 'watchers/error',
}
