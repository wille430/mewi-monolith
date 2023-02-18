import router from 'next/router'
import {useAppSelector} from './index'
import {useEffect} from 'react'

export const useUser = ({redirectTo = '', redirectIfFound = false} = {}) => {
    const {isLoggedIn, user, isReady} = useAppSelector((state) => state.user)

    useEffect(() => {
        if (!redirectTo || !isReady) {
            return
        }

        if ((!redirectIfFound && !isLoggedIn) || (redirectIfFound && isLoggedIn)) {
            router.replace(redirectTo, undefined, {
                shallow: true,
            }).then()
        }
    }, [isLoggedIn, isReady])

    return {user}
}
