import type { IUser } from '@/common/schemas'
import type { AxiosRequestConfig } from 'axios'
import { client } from '.'

export const getMe = async (config: AxiosRequestConfig = {}) => {
    return client
        .get<IUser | undefined>('/users/me', config)
        .then((res) => res.data)
        .catch(() => undefined)
}
