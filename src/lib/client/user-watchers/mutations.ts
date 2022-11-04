import { IUserWatcher } from '@/common/schemas'
import type { CreateWatcherDto } from '@/lib/modules/watchers/dto/create-watcher.dto'
import { client, MutationArgs } from '..'
import { MY_WATCHERS_KEY } from './swr-keys'

export const createUserWatcher = (data: CreateWatcherDto): MutationArgs => {
    const updateFn = async (watchers: IUserWatcher[]) => {
        const watcher = await client.post<never, IUserWatcher>('/user-watchers', data)

        const i = watchers.findIndex((x) => x.id === undefined)
        watchers[i] = watcher

        return watchers
    }

    const optimisticData = (watchers?: IUserWatcher[]) => {
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
