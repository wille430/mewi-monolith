import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import { User } from '@mewi/prisma'

export const useUser = ({ redirectTo = '', redirectIfFound = false } = {}) => {
    const { data: user, mutate: mutateUser } = useSWR<User | undefined>('/api/user')

    const router = useRouter()

    useEffect(() => {
        if (!redirectTo || !user) return

        if ((redirectTo && !redirectIfFound && !user) || (redirectIfFound && user)) {
            router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])

    return { user, mutateUser }
}
