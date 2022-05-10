// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'
import { USER_TOKEN } from './constants'

export const sessionOptions: IronSessionOptions = {
    password: process.env.SESSION_PASSWORD,
    cookieName: USER_TOKEN,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}
