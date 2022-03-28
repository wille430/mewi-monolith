import { createAction } from '@reduxjs/toolkit'
import { SnackbarActionTypes } from 'store/snackbar/type'
import { SnackbarProps } from 'components/Snackbar/Snackbar'

export const pushToSnackbar = createAction(
    SnackbarActionTypes.PUSH,
    (props: Omit<SnackbarProps, 'defaultValue'>) => ({
        payload: props,
    })
)

export const nextSnackbar = createAction(SnackbarActionTypes.GET_NEXT)

export const clearSnackbarQueue = createAction(SnackbarActionTypes.CLEAR_QUEUE)
