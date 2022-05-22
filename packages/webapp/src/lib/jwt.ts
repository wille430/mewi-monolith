import { ACCESS_TOKEN_COOKIE, AuthTokens, REFRESH_TOKEN_COOKIE } from '@wille430/common'
import { setHeaders } from './axios'

export const setJwt = (tokens: AuthTokens | undefined = undefined) => {
    window.sessionStorage.setItem(ACCESS_TOKEN_COOKIE, tokens?.access_token)
    window.localStorage.setItem(REFRESH_TOKEN_COOKIE, tokens?.refresh_token)

    // update axios
    setHeaders()
}

export const getJwt = (): AuthTokens | undefined => {
    if (typeof window === 'undefined') {
        return undefined
    }

    const authTokens: Partial<AuthTokens> = {
        access_token: window.sessionStorage.getItem(ACCESS_TOKEN_COOKIE),
        refresh_token: window.localStorage.getItem(REFRESH_TOKEN_COOKIE),
    }

    if (!authTokens.access_token || !authTokens.refresh_token) {
        return undefined
    } else {
        return authTokens as AuthTokens
    }
}
