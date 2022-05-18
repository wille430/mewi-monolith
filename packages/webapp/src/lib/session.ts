// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'
import { useEffect } from 'react'
import { USER_TOKEN } from './constants'
import { fetchJson } from './fetchJson'
import { useUser } from './useUser'
import { setLoggedInStatus } from '@/store/user'
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
    const { user, mutateUser } = useUser()

    useEffect(() => {
        mutateUser(fetchJson('/api/user')).catch((e) => console.log(e))
    }, [])

    useEffect(() => {
        dispatch(setLoggedInStatus(Boolean(user)))
    }, [user])
}
