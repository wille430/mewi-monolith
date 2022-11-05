import useSWR from 'swr'
import router from 'next/router'
import { useAppDispatch, useAppSelector } from '.'
import { setLoggedInStatus } from '../store/user'
import { useEffect, useState } from 'react'
import { CURRENT_USER_SWR_KEY } from '../client/users/swr-keys'
import { getMe } from '../client'

export const useUser = ({ redirectTo = '', redirectIfFound = false } = {}) => {
    const dispatch = useAppDispatch()
    const { isLoggedIn } = useAppSelector((state) => state.user)

    const [isFirstRender, setIsFirstRender] = useState(true)

    const { data: user, mutate: mutateUser } = useSWR(CURRENT_USER_SWR_KEY, getMe, {
        onSuccess: (user) => {
            if (user) {
                dispatch(setLoggedInStatus(Boolean(user.id), user))
            }
        },
        onError: () => {
            dispatch(setLoggedInStatus(false))
        },
    })

    useEffect(() => {
        if (!redirectTo || isFirstRender) {
            setIsFirstRender(false)
            return
        }

        if ((!redirectIfFound && !isLoggedIn) || (redirectIfFound && isLoggedIn)) {
            router.replace(redirectTo, undefined, {
                shallow: true,
            })
        }
    }, [isLoggedIn])

    return { user, refetchUser: mutateUser }
}
