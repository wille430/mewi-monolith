import type { IUser } from '@wille430/common'

export interface UserState {
    isLoggedIn: boolean
    user?: IUser
}

export enum UserActionTypes {
    SET_LOGGED_IN_STATUS = 'user/set-logged-in-status',
    LOGIN = 'user/login',
    SIGNUP = 'user/signup',
    LOGOUT = 'user/logout',
    FETCH = 'user/fetch',
}
