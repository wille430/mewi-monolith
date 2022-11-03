import type { IUser } from '@/common/schemas'
import type { AxiosRequestConfig } from 'axios'
import { client, MutationArgs } from '..'
import { USER_SWR_KEY } from '../../constants/swr-keys'
import { UpdateEmailDto } from '../../modules/users/dto/update-email.dto'

export const getMe = async (config: AxiosRequestConfig = {}) => {
    return client.get<IUser | undefined>('/users/me', config).catch(() => undefined)
}

export const updateEmail = (newEmail: string): MutationArgs => {
    const updateFn = () => {
        return client.put('/users/email', { newEmail } as UpdateEmailDto)
    }

    return [USER_SWR_KEY, updateFn()]
}
