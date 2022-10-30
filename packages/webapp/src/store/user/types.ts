export interface UserState {
    isLoggedIn: boolean
}

export enum UserActionTypes {
    SET_LOGGED_IN_STATUS = 'user/set-logged-in-status',
    LOGIN = 'user/login',
    SIGNUP = 'user/signup',
    LOGOUT = 'user/logout',
}
