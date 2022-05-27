// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { USER_TOKEN } from './constants'
import { fetchUser } from '@/store/user'
import { useAppDispatch } from '@/hooks'

export const sessionOptions: IronSessionOptions = {
    password: process.env.SESSION_PASSWORD,
    cookieName: USER_TOKEN,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
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

export const checkLoggedInStatus = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        dispatch(fetchUser())
    }, [router.events])
}
