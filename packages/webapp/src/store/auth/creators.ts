import { AuthTokens } from '@wille430/common'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AuthActionTypes } from './types'

export const onAuthLoad = createAction(
    AuthActionTypes.AUTH_LOAD,
    (): { payload: Partial<AuthTokens> } => {
        return {
            payload: {
                access_token: localStorage.getItem('access_token') ?? undefined,
                refresh_token: localStorage.getItem('refresh_token') ?? undefined,
            },
        }
    }
)

export const loginUser = createAction(AuthActionTypes.AUTH_LOGIN, (authTokens: AuthTokens) => ({
    payload: authTokens,
}))

export const logOut = createAction(AuthActionTypes.AUTH_LOGOUT)

export const refreshAccessToken = createAsyncThunk(
    AuthActionTypes.AUTH_REFRESH,
    async (args, thunkAPI) => {
        console.log('refreshing token...')
        const oldRefreshToken = localStorage.getItem('refresh_token')

        const authTokens = await axios
            .post<AuthTokens>('/auth/token', { refresh_token: oldRefreshToken })
            .then((res) => {
                console.log('fulfilled')
                return res.data
            })
            .catch((e) => {
                console.log('rejecting')
                return thunkAPI.rejectWithValue(e)
            })

        console.log(authTokens)

        return authTokens
    }
)

export const loadPage = createAction(AuthActionTypes.AUTH_PAGE_LOAD)
