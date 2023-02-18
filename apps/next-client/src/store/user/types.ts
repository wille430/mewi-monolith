import {UserDto} from "@mewi/models"

export interface UserState {
    isLoggedIn: boolean
    user: UserDto | null
    isReady: boolean
}

export enum UserActionTypes {
    LOGIN = 'user/login',
    SIGNUP = 'user/signup',
    LOGOUT = 'user/logout',
    GET_USER = 'user/get',
}
