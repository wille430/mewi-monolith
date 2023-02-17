import {createAction, createAsyncThunk} from '@reduxjs/toolkit'
import {UserActionTypes} from './types'
import {client} from '@/lib/client'
import {UserDto} from "@mewi/models"

export const setLoggedInStatus = createAction(
    UserActionTypes.SET_LOGGED_IN_STATUS,
    (status: boolean, user: UserDto | undefined = undefined) => {
        return {
            payload: {status, user},
        }
    }
)

export const logout = createAsyncThunk(UserActionTypes.LOGOUT, async () => {
    await client.post('/auth/logout')
    return true
})

export const login = createAsyncThunk(
    UserActionTypes.LOGIN,
    async ({email, password}: { email: string; password: string }, thunkApi) => {
        try {
            await client
                .post('/auth/login', {email, password})
                .then((res: any) => res.data)
                .catch((e: any) => {
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
                .then((res: any) => res.data)
                .catch((e: any) => {
                    throw e.data
                })

            return true
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)
