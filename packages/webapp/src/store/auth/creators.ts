import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { login, refreshJwtToken, signUp } from 'api'
import { AuthActionTypes } from './types'

export const onAuthLoad = createAction(AuthActionTypes.AUTH_LOAD, () => {
    return {
        payload: {
            jwt: localStorage.getItem('jwt'),
            refreshToken: localStorage.getItem('refreshToken'),
        },
    }
})

export const loginUser = createAsyncThunk(
    AuthActionTypes.AUTH_LOGIN,
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const authTokens = await login(email, password)
            return authTokens
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const createUser = createAsyncThunk(
    AuthActionTypes.AUTH_SIGNUP,
    async (data: Parameters<typeof signUp>, thunkAPI) => {
        try {
            const authTokens = await signUp(...data)
            return authTokens
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const logOut = createAction(AuthActionTypes.AUTH_LOGOUT, () => ({ payload: {} }))

export const refreshAccessToken = createAsyncThunk(
    AuthActionTypes.AUTH_REFRESH,
    async (args, thunkAPI) => {
        try {
            const oldAccessToken = localStorage.getItem('refreshToken')

            const authTokens = await refreshJwtToken(oldAccessToken)
            return authTokens
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)
