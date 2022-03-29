import { Error } from '@mewi/common'
import { AuthTokens } from '@mewi/common/types'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { signUp } from 'api'
import authApi from 'api/authApi'
import axios from 'axios'
import { AuthActionTypes, AuthState } from './types'

export const onAuthLoad = createAction(AuthActionTypes.AUTH_LOAD, (): { payload: AuthTokens } => {
    return {
        payload: {
            access_token: localStorage.getItem('access_token'),
            refresh_token: localStorage.getItem('refresh_token'),
        },
    }
})

export const loginUser = createAsyncThunk(
    AuthActionTypes.AUTH_LOGIN,
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const authTokens = await axios
                .post('/auth/login', { email, password })
                .then((res) => res.data)

            return authTokens
        } catch (e: any) {
            let errors: AuthState['errors'] = {}
            switch (e.error) {
                case Error.Auth.INVALID_EMAIL:
                case Error.Auth.INVALID_PASSWORD:
                case Error.Auth.MISSING_USER:
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

            return thunkAPI.rejectWithValue(errors || {})
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
                case Error.Auth.INVALID_EMAIL:
                    errors = {
                        email: 'Felaktig epostaddress',
                    }
                    break
                case Error.Auth.USER_ALREADY_EXISTS:
                    errors = {
                        email: 'Epostaddressen är upptagen',
                    }
                    break
                case Error.Auth.PASSWORD_NOT_STRONG_ENOUGH:
                    errors = {
                        password:
                            'Lösenordet är för svagt. Använd minst 8 bokstäver, special tecken, stor bokstav och siffror',
                    }
                    break
                case Error.Auth.PASSWORD_TOO_LONG:
                    errors = {
                        password:
                            'Lösenordet är för långt. Använd minst 8 bokstäver och max 30 bokstäver',
                    }
                    break
                case Error.Auth.PASSWORD_NOT_MATCHING:
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
            const oldAccessToken = localStorage.getItem('refresh_token')

            const authTokens = await authApi.refreshJwtToken(oldAccessToken)
            return authTokens
        } catch (e) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const loadPage = createAction(AuthActionTypes.AUTH_PAGE_LOAD)

export type changePasswordErrorPayload = { password: string; repassword: string; general: string }

export const changePassword = createAsyncThunk(
    AuthActionTypes.CHANGE_PASSWORD,
    async (args: Parameters<typeof authApi.changePassword>, thunkApi) => {
        try {
            await authApi.changePassword(...args)
            return
        } catch (e: any) {
            const errorMessages: changePasswordErrorPayload = {
                password: '',
                repassword: '',
                general: '',
            }
            switch (e.error) {
                case Error.Auth.PASSWORD_TOO_LONG:
                    errorMessages.password = 'Lösenordet är för långt'
                    break
                case Error.Auth.PASSWORD_NOT_STRONG_ENOUGH:
                    errorMessages.password = 'Lösenordet är inte starkt nog'
                    break
                case Error.Auth.PASSWORD_NOT_MATCHING:
                    errorMessages.repassword = 'Lösenorden matchar inte'
                    break
                case Error.Auth.INVALID_JWT:
                    errorMessages.general = 'Länken är inte giltig längre'
                    break
                default:
                    errorMessages.general = 'Ett fel inträffade'
            }

            return thunkApi.rejectWithValue(errorMessages)
        }
    }
)
