// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'
import { REFRESH_TOKEN_EXPIRES, USER_TOKEN } from './constants'

export const sessionOptions: IronSessionOptions = {
    password: process.env.SESSION_PASSWORD,
    cookieName: USER_TOKEN,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        expires: REFRESH_TOKEN_EXPIRES(),
    },
}

/**
 * Log out a current session and return redirect object
 *
 * @param req The API request object
 * @returns A Next redirect object with destination route '/loggain'
 */
export const logoutSession = (req: any) => {
    req.session.destroy()

    return {
        redirect: {
            destination: '/loggain',
        },
    }
}
