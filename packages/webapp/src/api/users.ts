import { instance } from '@/lib/axios'
import { IUser } from '@wille430/common'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

export const getMe = async (config: AxiosRequestConfig = {}, client: AxiosInstance = instance) => {
    return client
        .get<IUser | undefined>('/users/me', config)
        .then((res) => res.data)
        .catch(() => undefined)
}
