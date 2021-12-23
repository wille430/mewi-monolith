import { AuthErrorCodes } from '@mewi/types'
import { instance } from 'api'
import axios from 'axios'
import useAuthTokens from 'common/hooks/useAuthTokens'
import userReducer, { UserReducerAction } from 'common/reducers/userReducer'
import e from 'cors'
import { createContext, ReactNode, useEffect } from 'react'

interface UserContextProps {
    isLoggedIn: boolean
    isLoading: boolean
    userDispatch: (action: UserReducerAction) => any
}

export const UserContext = createContext<UserContextProps>({
    isLoggedIn: false,
    isLoading: false,
    userDispatch: (action: UserReducerAction) => {},
})

interface UserProviderProps {
    children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps) => {
    const { authTokens, setAuthTokens } = useAuthTokens()
    const { userState, userDispatch } = userReducer({ authTokens, setAuthTokens })

    useEffect(() => {
        console.log('Auth token changed!')

        axios.defaults.baseURL = process.env.NX_API_URL

        axios.interceptors.request.use((request) => {
            if (request.headers && authTokens.jwt) {
                request.headers['Authorization'] = 'Bearer ' + authTokens.jwt
            }
            return request
        })

        axios.interceptors.response.use(
            (response) => {
                return response
            },
            async (err) => {
                const config = err.config

                if (err.response) {
                    // jwt was expired
                    if (err.response.status === 401 && config.url !== '/auth/login' && !config._retry) {
                        config._retry = true

                        try {
                            return await new Promise((resolve) => {
                                const handleCallback = () => {
                                    resolve(instance(config))
                                }
                                userDispatch({ type: 'refreshTokens', callback: handleCallback })
                            })
                        } catch (e: any) {
                            alert(e)
                            return Promise.reject(err.response.data)
                        }
                    } else {
                        return Promise.reject(err.response.data)
                    }
                }
                return Promise.reject(err)
            }
        )
    }, [authTokens])

    return (
        <UserContext.Provider
            value={{
                isLoggedIn: Boolean(authTokens.jwt),
                isLoading: userState.isLoading,
                userDispatch: userDispatch,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
