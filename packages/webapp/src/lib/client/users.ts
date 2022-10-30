import type { IUser } from '@wille430/common'
import type { AxiosRequestConfig } from 'axios'
import { client } from '.'

export const getMe = async (config: AxiosRequestConfig = {}) => {
    return client
        .get<IUser | undefined>('/users/me', config)
        .then((res) => res.data)
        .catch(() => undefined)
}
