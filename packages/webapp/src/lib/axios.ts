import { AuthTokens } from '@wille430/common'
import axios from 'axios'
import { getJwt, setJwt } from './jwt'

export const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Authorization: `Bearer ${getJwt()?.access_token}`,
    },
    withCredentials: true,
})

instance.interceptors.response.use(
    (res) => {
        return res
    },
    async (err) => {
        const config = err.config

        console.log('JWT is expired or invalid', err.status, config.url, config._retry)

        if (err.response.status === 401 && config.url !== '/auth/login' && !config._retry) {
            config._retry = true

            console.log('Refreshing jwt...')

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

export const updateAxios = () => {
    const authTokens = getJwt()
    instance.defaults.headers.common['Authorization'] = `Bearer ${authTokens?.access_token}`
}
