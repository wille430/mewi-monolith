export const USER_TOKEN = 'user-session'

export const JWT_SECRET_KEY = 'aikntcjhvfquieiwfayhyalbuwbzsdof'

export const REFRESH_TOKEN_EXPIRES = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
export const ACCESS_TOKEN_EXPIRES = () =>
    process.env.NODE_ENV === 'development'
        ? new Date(Date.now() + 10 * 1000)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

export const ACCESS_TOKEN_COOKIE = 'access-token'
export const REFRESH_TOKEN_COOKIE = 'refresh-token'
export const ACCESS_TOKEN_EXPIRATION = 'access-token-expiration'
