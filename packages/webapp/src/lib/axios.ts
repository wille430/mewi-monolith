import axios from 'axios'

export const setupAxios = () => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

    axios.interceptors.response.use(
        (res) => {
            return res
        },
        (err) => {
            return Promise.reject(err.response ?? err)
        }
    )
}
