import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_EXPIRATION,
    AuthTokens,
    REFRESH_TOKEN_COOKIE,
} from '@wille430/common'
import Cookies from 'cookies'
import { ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from './constants'

export const getCookie = (name: string) => {
    return document.cookie.split(';').some((c) => {
        return c.trim().startsWith(name + '=')
    })
}

export const deleteCookie = (name: string, path?: string, domain?: string) => {
    if (getCookie(name)) {
        document.cookie =
            name +
            '=' +
            (path ? ';path=' + path : '') +
            (domain ? ';domain=' + domain : '') +
            ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
}

export const setJwtCookies = (cookies: Cookies, tokens: AuthTokens) => {
    cookies.set(ACCESS_TOKEN_COOKIE, tokens.access_token)
    cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
        expires: REFRESH_TOKEN_EXPIRES(),
    })
    cookies.set(ACCESS_TOKEN_EXPIRATION, ACCESS_TOKEN_EXPIRES().toUTCString())
}
