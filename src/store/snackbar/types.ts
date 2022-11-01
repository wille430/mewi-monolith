import type { SnackbarProps } from '@/components/Snackbar/Snackbar'

export interface SnackbarState {
    queue: SnackbarProps[]
    current?: SnackbarProps
}

export enum SnackbarActionTypes {
    CLEAR_QUEUE = 'snackbar/clear',
    GET_NEXT = 'snackbar/next',
    PUSH = 'snackbar/push',
    CHECK_PARAMS = 'snackbar/check_params',
}
