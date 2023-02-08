import type { IUser } from '@/common/schemas'
import { client, MutationArgs } from '../index'
import { UpdateEmailDto } from '../../modules/users/dto/update-email.dto'
import { CHANGE_EMAIL_SWR_KEY } from './swr-keys'

export const getMe = async () => {
    return client.get<never, IUser>('/users/me')
}

export const updateEmail = (newEmail: string): MutationArgs => {
    const updateFn = () => {
        return client.put('/users/email', { newEmail } as UpdateEmailDto)
    }

    return [CHANGE_EMAIL_SWR_KEY, updateFn()]
}
