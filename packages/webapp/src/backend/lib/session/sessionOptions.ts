import { SESSION_COOKIE } from '@/constants/cookies'

export const sessionOptions = {
    cookieName: SESSION_COOKIE,
    password: process.env.SESSION_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}
