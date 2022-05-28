export const USER_TOKEN = 'user-session'

export const JWT_SECRET_KEY = 'aikntcjhvfquieiwfayhyalbuwbzsdof'

export const REFRESH_TOKEN_EXPIRES = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
