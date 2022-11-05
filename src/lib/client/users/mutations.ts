import { IUser, Role } from '@/common/schemas'
import { client, MutationArgs } from '..'
import { ALL_USERS_KEY } from './swr-keys'

export const updateUserRoles = (userId: string, roles: Role[]): MutationArgs => {
    const updateFn = async (users: IUser[]) => {
        await client.put<never, IUser>('/users/' + userId, {
            roles,
        })

        return users
    }

    const optimisticData = (users: IUser[] = []) => {
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
