import type {CreateWatcherDto} from '@/lib/modules/watchers/dto/create-watcher.dto'
import {client, MutationArgs} from '../index'
import {MY_WATCHERS_KEY} from './swr-keys'
import {UserWatcherDto} from "@mewi/models"

export const createUserWatcher = (data: CreateWatcherDto): MutationArgs => {
    const updateFn = async (watchers: UserWatcherDto[]) => {
        const watcher = await client.post<never, UserWatcherDto>('/user-watchers', data)

        const i = watchers.findIndex((x) => x.id === undefined)
        watchers[i] = watcher

        return watchers
    }

    const optimisticData = (watchers?: UserWatcherDto[]) => {
        if (!watchers) {
            watchers = []
        }

        watchers.push({
            id: undefined as any,
            user: undefined as any,
            watcher: {
                ...data,
            } as any,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        return watchers
    }

    return [
        MY_WATCHERS_KEY,
        updateFn,
        {
            optimisticData,
        },
    ]
}

export const removeUserWatcher = (watcherId: string): MutationArgs => {
    const updateFn = async (watchers: UserWatcherDto[]) => {
        await client.delete(`/user-watchers/${watcherId}`)
        return watchers
    }

    const optimisticData = (watchers: UserWatcherDto[] = []) => {
        return watchers.filter((watcher) => watcher.id !== watcherId)
    }

    return [MY_WATCHERS_KEY, updateFn, {optimisticData}]
}
