import axios from 'axios'
import { refreshAccessToken } from 'store/auth/creators'
import { store as Store } from 'store/index'

const setupInterceptors = (store: typeof Store) => {
    console.log('Updating axios config...')
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/'

    axios.interceptors.request.use((request) => {
        const accessToken = localStorage.getItem('access_token')
        if (request.headers && accessToken) {
            request.headers['Authorization'] = 'Bearer ' + accessToken
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
                    const { dispatch } = store
                    dispatch(refreshAccessToken())
                    return Promise.reject(err.response.data)
                } else {
                    return Promise.reject(err.response.data)
                }
            }
            return Promise.reject(err)
        }
    )
}

export default setupInterceptors
