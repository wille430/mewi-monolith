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

        if (
            err.response &&
            err.response.status === 401 &&
            config.url !== '/auth/login' &&
            config.url !== '/auth/token' &&
            !config._retry
        ) {
            config._retry = true

            try {
                // refetch jwt token
                await instance.post('/auth/token')

                return axios(config)
            } catch (e) {
                return Promise.reject(err.response ?? err)
            }
        } else {
            return Promise.reject(err.response ?? err)
        }
    }
)
