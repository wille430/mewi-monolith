import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '.'
import { fetchUser } from '@/store/user'

export const useUser = ({ redirectTo = '', redirectIfFound = false } = {}) => {
    const dispatch = useAppDispatch()
    const { user, isLoggedIn } = useAppSelector((state) => state.user)
    const isFirstRender = useRef(true)

    const router = useRouter()

    useEffect(() => {
        dispatch(fetchUser()).then(() => (isFirstRender.current = false))
    }, [])

    useEffect(() => {
        if (!redirectTo || !isLoggedIn || isFirstRender.current) return

        if ((redirectTo && !redirectIfFound && !isLoggedIn) || (redirectIfFound && isLoggedIn)) {
            router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])
}
