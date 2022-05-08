import axios from 'axios'

export const setupAxios = () => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
}
