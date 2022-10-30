import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { UserActionTypes } from './types'
import { client } from '@/lib/client'

export const setLoggedInStatus = createAction(
    UserActionTypes.SET_LOGGED_IN_STATUS,
    (status: boolean) => {
        return {
            payload: status,
        }
    }
)

export const logout = createAsyncThunk(UserActionTypes.LOGOUT, async () => {
    await client.post('/auth/logout')
    return true
})

export const login = createAsyncThunk(
    UserActionTypes.LOGIN,
    async ({ email, password }: { email: string; password: string }, thunkApi) => {
        try {
            await client
                .post('/auth/login', { email, password })
                .then((res) => res.data)
                .catch((e) => {
                    throw e.data
                })

            return true
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)

export const signup = createAsyncThunk(
    UserActionTypes.SIGNUP,
    async (args: { email?: string; password?: string; passwordConfirm?: string }, thunkApi) => {
        try {
            await client
                .post('/auth/signup', args)
                .then((res) => res.data)
                .catch((e) => {
                    throw e.data
                })

            return true
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)
