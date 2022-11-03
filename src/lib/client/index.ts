import axios from 'axios'
import type { mutate } from 'swr'

export * from './users/users'
export * from './auth/auth'

export const client = axios.create({
    baseURL: '/api',
    withCredentials: true,
})

export type MutationArgs = Parameters<typeof mutate>
