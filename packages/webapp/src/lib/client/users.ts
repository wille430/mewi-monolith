import type { IUser } from '@wille430/common'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { instance } from '@/lib/axios'

export const getMe = async (config: AxiosRequestConfig = {}, client: AxiosInstance = instance) => {
    return client
        .get<IUser | undefined>('/users/me', config)
        .then((res) => res.data)
        .catch(() => undefined)
}
