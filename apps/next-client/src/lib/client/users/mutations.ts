import type {ChangePasswordWithToken} from '@/lib/modules/users/dto/change-password.dto'
import {client, MutationArgs} from '../index'
import {ALL_USERS_KEY} from './swr-keys'
import {Role, UserDto} from "@mewi/models"

export const updateUserRoles = (userId: string, roles: Role[]): MutationArgs => {
    const updateFn = async (users: UserDto[]) => {
        await client.put<never, UserDto>('/users/' + userId, {
            roles,
        })

        return users
    }

    const optimisticData = (users: UserDto[] = []) => {
        const index = users?.findIndex((user) => user.id === userId)

        users[index] = {
            ...users[index],
            roles: roles,
        }

        return users
    }

    return [
        ALL_USERS_KEY,
        updateFn,
        {
            optimisticData,
        },
    ]
}

export const updatePasswordMutation = (data: ChangePasswordWithToken) => {
    return client.put<never, any>('/users/password', data)
}
