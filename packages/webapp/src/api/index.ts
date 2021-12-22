import axios from 'axios'

export * from './searchApi'
export * from './userApi'
export * from './authApi'
export * from './watcherApi'

export const instance = axios.create({
    baseURL: process.env.NX_API_URL,
})
