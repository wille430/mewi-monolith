import { useEffect } from 'react'
import useSWR from 'swr'
import router from 'next/router'
import { useAppDispatch } from '.'
import type { User } from '@/backend/modules/schemas/user.schema'
import { setLoggedInStatus } from '@/store/user'

export const useUser = ({ redirectTo = '', redirectIfFound = false } = {}) => {
    const { data: user, mutate: mutateUser } = useSWR<User>('/api/users/me')
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!redirectTo || !user) return

        dispatch(setLoggedInStatus(Boolean(user.id)))
        if ((!redirectIfFound && !user.id) || (redirectIfFound && user.id)) {
            router.replace(redirectTo, undefined, {
                shallow: true,
            })
        }
    }, [user, redirectIfFound, redirectTo])

    return { user, refetchUser: mutateUser }
}
