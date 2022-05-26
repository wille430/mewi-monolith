import { User } from '@mewi/prisma/index-browser'

export interface UserState {
    isLoggedIn: boolean
    user?: User
}

export enum UserActionTypes {
    SET_LOGGED_IN_STATUS = 'user/set-logged-in-status',
    LOGIN = 'user/login',
    SIGNUP = 'user/signup',
    LOGOUT = 'user/logout',
    FETCH = 'user/fetch',
}
