import { AuthErrorCodes } from '@mewi/types'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { login, refreshJwtToken, signUp } from 'api'
import { AuthActionTypes, AuthState } from './types'

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
            let errors: AuthState['errors'] = {}
            switch (e.error.type) {
                case AuthErrorCodes.INVALID_EMAIL:
                case AuthErrorCodes.INVALID_PASSWORD:
                case AuthErrorCodes.MISSING_USER:
                    errors = {
                        ...errors,
                        email: 'Felaktig epostaddress eller lösenord',
                        password: 'Felaktig epostaddress eller lösenord',
                    }
                    break
                default:
                    errors = {
                        ...errors,
                        all: 'Ett fel inträffade. Försök igen.',
                    }
                    break
            }

            return thunkAPI.rejectWithValue(errors)
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
            let errors: AuthState['errors'] = {}

            switch (e.error?.type) {
                case AuthErrorCodes.INVALID_EMAIL:
                    errors = {
                        email: 'Felaktig epostaddress',
                    }
                    break
                case AuthErrorCodes.USER_ALREADY_EXISTS:
                    errors = {
                        email: 'Epostaddressen är upptagen',
                    }
                    break
                case AuthErrorCodes.PASSWORD_NOT_STRONG_ENOUGH:
                    errors = {
                        password:
                            'Lösenordet är för svagt. Använd minst 8 bokstäver, special tecken, stor bokstav och siffror',
                    }
                    break
                case AuthErrorCodes.PASSWORD_TOO_LONG:
                    errors = {
                        password:
                            'Lösenordet är för långt. Använd minst 8 bokstäver och max 30 bokstäver',
                    }
                    break
                case AuthErrorCodes.PASSWORD_NOT_MATCHING:
                    errors = {
                        repassword: 'Lösenorden måste matcha',
                    }
                    break
                default:
                    errors = {
                        all: 'Ett fel inträffade. Försök igen',
                    }
                    break
            }

            return thunkAPI.rejectWithValue(errors)
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

export const loadPage = createAction(AuthActionTypes.AUTH_PAGE_LOAD)
