import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '.'
import { fetchUser } from '@/store/user'

export const useUser = ({ redirectTo = '', redirectIfFound = false } = {}) => {
    const dispatch = useAppDispatch()
    const { user, isLoggedIn } = useAppSelector((state) => state.user)

    const [isFirstRender, setIsFirstRender] = useState(true)
    const router = useRouter()

    const refetchUser = () => dispatch(fetchUser()).then(() => setIsFirstRender(false))

    useEffect(() => {
        refetchUser()
    }, [])

    useEffect(() => {
        if (!redirectTo || isFirstRender) return

        if ((!redirectIfFound && !isLoggedIn) || (redirectIfFound && isLoggedIn)) {
            router.replace(redirectTo, undefined, {
                shallow: true,
            })
        }
    }, [user, redirectIfFound, redirectTo, isFirstRender])

    return { user, refetchUser }
}
