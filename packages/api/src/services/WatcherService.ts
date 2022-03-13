import WatcherModel from 'models/WatcherModel'
import { UserService } from './UserServices'
import { APIError, DatabaseErrorCodes, SearchFilterDataProps } from '@mewi/types'

export default class WatcherService {
    watcher_id: string

    constructor(watcher_id) {
        this.watcher_id = watcher_id
    }

    static async getAll() {
        return await WatcherModel.find({})
    }

    async delete(userId: string) {
        // Remove watcher from user
        const user = await UserService.userById(userId)
        try {
            user.watchers.pull(this.watcher_id)
        } catch (e) {
            console.log(e.message)
        }
        await user.save()

        // Remove user from watcher
        const watcher = await this.watcher()
        if (!watcher) return

        watcher.users = watcher.users.filter((uid) => uid.toString() !== userId)

        // Remove watcher if not in use
        if (watcher.users.length <= 0) {
            await watcher.remove()
        } else {
            await watcher.save()
        }
    }

    async watcher() {
        const watcher = await WatcherModel.findById(this.watcher_id)
        if (!watcher) return null
        return watcher
    }

    static async create(metadata: SearchFilterDataProps) {
        const similarWatcher = await WatcherModel.findOne({ metadata })

        if (!similarWatcher) {
            // Create new watcher
            const newWatcher = await WatcherModel.create({
                metadata,
            }).catch((e) => {
                throw console.log(e)
            })

            return newWatcher
        } else {
            throw new APIError(
                409,
                DatabaseErrorCodes.CONFLICTING_RESOURCE,
                'The query already exists on a watcher. The query must be unique.'
            )
        }
    }

    static async isUserInWatcherWithQuery(userId: string, metadata: SearchFilterDataProps) {
        const similarWatcher = await WatcherModel.findOne({ metadata }, { users: 1 })

        if (!similarWatcher) return false

        const userInWatcher = similarWatcher.users.find((x) => x.toString() === userId)

        return !!userInWatcher
    }
}
