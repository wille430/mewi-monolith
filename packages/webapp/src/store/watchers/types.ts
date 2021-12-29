import { PublicWatcher } from '@mewi/types'

export interface WatchersState {
    watchers: PublicWatcher[]
    isLoading: boolean
    error: string
}

export enum WatchersActionType {
    WATCHERS_ADD = 'watchers/create',
    WATCHERS_FETCH = 'watchers/getAll',
    WATCHERS_DELETE = 'watchers/delete',
    WATHCERS_ERROR = 'watchers/error',
}
