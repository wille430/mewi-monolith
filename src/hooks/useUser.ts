import { useEffect } from 'react'
import useSWR from 'swr'
import router from 'next/router'
import { IUser } from '@/common/schemas'
import { useAppDispatch } from '.'
import { setLoggedInStatus } from '@/store/user'

export const useUser = ({ redirectTo = '', redirectIfFound = false } = {}) => {
    const { data: user, mutate: mutateUser } = useSWR<IUser>('/api/users/me')
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!redirectTo || !user) return

        dispatch(setLoggedInStatus(Boolean(user.id), user))
        if ((!redirectIfFound && !user.id) || (redirectIfFound && user.id)) {
            router.replace(redirectTo, undefined, {
                shallow: true,
            })
        }
    }, [user, redirectIfFound, redirectTo, dispatch])

    return { user, refetchUser: mutateUser }
}
