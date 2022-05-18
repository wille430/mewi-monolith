import { createAction } from '@reduxjs/toolkit'
import { SuccessParam } from '@wille430/common'
import { uniqueId } from 'lodash'
import { SnackbarActionTypes } from './types'
import { SnackbarProps } from '@/components/Snackbar/Snackbar'

export const pushToSnackbar = createAction(
    SnackbarActionTypes.PUSH,
    (props: Omit<SnackbarProps, 'defaultValue'>) => ({
        payload: props,
    })
)

export const nextSnackbar = createAction(SnackbarActionTypes.GET_NEXT)

export const clearSnackbarQueue = createAction(SnackbarActionTypes.CLEAR_QUEUE)

export const checkSuccessParam = createAction(
    SnackbarActionTypes.CHECK_PARAMS,
    (): { payload: SnackbarProps | undefined } => {
        const params = new URLSearchParams(window.location.search)

        const successParm = params.get('success') as SuccessParam | undefined
        let snackbarProps: SnackbarProps | undefined

        if (successParm) {
            switch (successParm) {
                case SuccessParam.UpdatedEmail:
                    snackbarProps = {
                        id: uniqueId(),
                        title: 'E-postadressen ändrades!',
                    }
                    break
            }
        }

        return { payload: snackbarProps }
    }
)
