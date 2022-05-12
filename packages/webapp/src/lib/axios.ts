import axios from 'axios'

export const setupAxios = () => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

    axios.interceptors.response.use(
        (res) => {
            return res
        },
        async (err) => {
            const config = err.config

            console.log('ERR:', err)

            console.log('Intercepting response error...', config.url, err.status)
            if (err.status === 401 && config.url !== '/auth/login' && !config._retry) {
                config._retry = true

                // refetch jwt token
                console.log('Refreshing tokens...')
                await fetch('/api/refreshjwt', {
                    credentials: 'include',
                }).catch(() => {
                    // when an error occured on this route, the session is destroyed
                    window.location.href = '/loggain'
                })

                return axios(config)
            } else if (config._retry && err.status === 401) {
                // Log out when retried request returns 401 again
                window.location.href = '/loggain'
            } else {
                return Promise.reject(err.response ?? err)
            }
        }
    )

    axios.defaults.withCredentials = true
}
