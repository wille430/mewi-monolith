import { createAction } from '@reduxjs/toolkit'
import { UserActionTypes } from './types'

export const setLoggedInStatus = createAction(
    UserActionTypes.SET_LOGGED_IN_STATUS,
    (status: boolean) => {
        return {
            payload: status,
        }
    }
)
