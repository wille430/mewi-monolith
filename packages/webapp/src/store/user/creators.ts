import { User } from '@mewi/prisma/index-browser'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthTokens } from '@wille430/common'
import axios from 'axios'
import { UserActionTypes } from './types'
import { setJwt } from '@/lib/jwt'
import { setHeaders } from '@/lib/axios'

export const setLoggedInStatus = createAction(
    UserActionTypes.SET_LOGGED_IN_STATUS,
    (status: boolean) => {
        return {
            payload: status,
        }
    }
)

export const fetchUser = createAsyncThunk(UserActionTypes.FETCH, async (args, thunkApi) => {
    try {
        return (await axios.get('/users/me').then((res) => res.data)) as User
    } catch (e) {
        await thunkApi.dispatch(logout())

        return thunkApi.rejectWithValue(undefined)
    }
})

export const logout = createAsyncThunk(UserActionTypes.LOGOUT, async () => {
    await fetch('/api/logout')
    setHeaders()
    return
})

export const login = createAsyncThunk(
    UserActionTypes.LOGIN,
    async ({ email, password }: { email: string; password: string }, thunkApi) => {
        try {
            const tokens: AuthTokens = await fetch('/api/login', {
                method: 'post',
                body: JSON.stringify({ email, password }),
            }).then(async (res) => {
                if (res.ok) {
                    return await res.json()
                } else {
                    throw await res.json()
                }
            })

            setJwt(tokens)

            await thunkApi.dispatch(fetchUser())

            return tokens
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)

export const signup = createAsyncThunk(
    UserActionTypes.SIGNUP,
    async (args: { email?: string; password?: string; passwordConfirm?: string }, thunkApi) => {
        try {
            const tokens: AuthTokens = await fetch('/api/signup', {
                method: 'post',
                body: JSON.stringify(args),
            }).then(async (res) => {
                if (res.ok) {
                    return await res.json()
                } else {
                    throw await res.json()
                }
            })

            setJwt(tokens)

            await thunkApi.dispatch(fetchUser())

            return tokens
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)
