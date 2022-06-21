import { ACCESS_TOKEN_COOKIE } from '@wille430/common'
import { useEffect, useRef } from 'react'
import { useAppDispatch } from '.'
import { fetchUser } from '@/store/user'

export const useFetchUserOnJwtChange = () => {
    const dispatch = useAppDispatch()
    const lastAccessToken = useRef<string | null>(null)

    useEffect(() => {
        addEventListener('storage', () => {
            const accessToken = window.sessionStorage.getItem(ACCESS_TOKEN_COOKIE)
            if (accessToken !== lastAccessToken.current) {
                dispatch(fetchUser())
                lastAccessToken.current = accessToken
            }
        })
    }, [])
}
