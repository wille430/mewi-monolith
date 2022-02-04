export interface AuthState {
    isLoggedIn: boolean
    isLoading: boolean
    errors: {
        email?: string
        password?: string
        repassword?: string
        all?: string
    }
}

export enum AuthActionTypes {
    AUTH_LOGIN = 'auth/login',
    AUTH_LOAD = 'auth/load',
    AUTH_LOGOUT = 'auth/logout',
    AUTH_SIGNUP = 'auth/signup',
    AUTH_REFRESH = 'auth/refreshToken',
}
