import { client, MutationArgs } from '../index'
import { UpdateEmailDto } from '../../lib/modules/users/dto/update-email.dto'
import { CHANGE_EMAIL_SWR_KEY } from './swr-keys'
import {UserDto} from "@mewi/models"

export const getMe = async () => {
    return client.get<never, UserDto>('/users/me')
}

export const updateEmail = (newEmail: string): MutationArgs => {
    const updateFn = () => {
        return client.put('/users/email', { newEmail } as UpdateEmailDto)
    }

    return [CHANGE_EMAIL_SWR_KEY, updateFn()]
}
