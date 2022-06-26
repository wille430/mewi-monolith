import axios from 'axios'

export const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

instance.interceptors.response.use(
    (res) => {
        return res
    },
    async (err) => {
        const config = err.config

        console.log('JWT is expired or invalid', err.status, config.url, config._retry)

        if (
            err.response.status === 401 &&
            config.url !== '/auth/login' &&
            config.url !== '/auth/token' &&
            !config._retry
        ) {
            config._retry = true

            console.log('Refreshing jwt...')

            try {
                // refetch jwt token
                await instance.post('/auth/token').catch((e) => {
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
