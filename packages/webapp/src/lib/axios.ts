import { AuthTokens } from '@wille430/common'
import axios from 'axios'
import { getJwt, setJwt } from './jwt'

export const setupAxios = () => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

    setHeaders()

    axios.interceptors.response.use(
        (res) => {
            return res
        },
        async (err) => {
            const config = err.config

            console.log(err.status)

            if (err.status === 401 && config.url !== '/auth/login' && !config._retry) {
                config._retry = true

                try {
                    // refetch jwt token
                    await fetch('/api/refreshjwt', {
                        credentials: 'include',
                    })
                        .then(async (res) => {
                            setJwt((await res.json()) as AuthTokens)
                        })
                        .catch((e) => {
                            throw e
                        })

                    return axios(config)
                } catch (e) {
                    return Promise.reject(err.response ?? err)
                }
                // } else if (config._retry && err.status === 401) {
                //     // Log out when retried request returns 401 again
                //     window.location.href = '/loggain'
            } else {
                return Promise.reject(err.response ?? err)
            }
        }
    )

    axios.defaults.withCredentials = true
}

export const setHeaders = () => {
    const authTokens = getJwt()
    axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens?.access_token}`
}
