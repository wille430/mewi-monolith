import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@wille430/common'
import { Response } from 'express'
import { AuthTokens } from '@/common/types/authTokens'

export const setJWTCookies = (res: Response, tokens: Partial<AuthTokens>) => {
    if (tokens.access_token) {
        res.cookie(ACCESS_TOKEN_COOKIE, tokens.access_token, {
            expires: new Date(Date.now() + 15 * 60 * 1000),
        })
    } else {
        res.cookie(ACCESS_TOKEN_COOKIE, undefined)
    }
    if (tokens.refresh_token) {
        res.cookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
    } else {
        res.cookie(REFRESH_TOKEN_COOKIE, undefined)
    }
}
