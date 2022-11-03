import useSWR from 'swr'
import router from 'next/router'
import { IUser } from '@/common/schemas'
import { useAppDispatch, useAppSelector } from '.'
import { setLoggedInStatus } from '../store/user'
import { CURRENT_USER_SWR_KEY } from '../constants/swr-keys'
import { useEffect, useState } from 'react'

export const useUser = ({ redirectTo = '', redirectIfFound = false } = {}) => {
    const dispatch = useAppDispatch()
    const { isLoggedIn } = useAppSelector((state) => state.user)

    const [isFirstRender, setIsFirstRender] = useState(true)

    const { data: user, mutate: mutateUser } = useSWR<IUser>(CURRENT_USER_SWR_KEY, {
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
