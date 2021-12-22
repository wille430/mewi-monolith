import { useEffect, useState } from 'react'
import { AuthTokens } from '@mewi/types'

interface useAuthTokensProps {
    authTokens: AuthTokens
    setAuthTokens: (authTokens: AuthTokens) => void
}

const useAuthTokens = (): useAuthTokensProps => {
    const getAuthTokens = () => {
        console.log('Updating tokens...')
        const jwt = localStorage.getItem('jwt') || undefined
        const refreshToken = localStorage.getItem('refreshToken') || undefined

        setAuthTokens({ jwt, refreshToken })
    }

    const [authTokens, setAuthTokens] = useState<AuthTokens>({})

    useEffect(() => {
        getAuthTokens()

        window.addEventListener('storage', () => {
            console.log('storage updated')
            getAuthTokens()
        })
    }, [])

    const saveAuthTokens = ({ jwt, refreshToken }: AuthTokens) => {
        if (jwt && refreshToken) {
            localStorage.setItem('jwt', jwt)
            localStorage.setItem('refreshToken', refreshToken)
            setAuthTokens({ jwt, refreshToken })
        } else {
            localStorage.removeItem('jwt')
            localStorage.removeItem('refreshToken')
            setAuthTokens({})
        }
    }

    return {
        authTokens: authTokens,
        setAuthTokens: saveAuthTokens,
    }
}

export default useAuthTokens
