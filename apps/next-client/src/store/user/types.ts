import {UserDto} from "@mewi/models"

export interface UserState {
    isLoggedIn: boolean
    user?: UserDto
}

export enum UserActionTypes {
    SET_LOGGED_IN_STATUS = 'user/set-logged-in-status',
    LOGIN = 'user/login',
    SIGNUP = 'user/signup',
    LOGOUT = 'user/logout',
}
