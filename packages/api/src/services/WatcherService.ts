import WatcherModel from "models/WatcherModel"
import { WatcherErrorCodes } from "types/watcher"
import SearchService from "./SearchService"
import { UserService } from "./UserServices"
import { APIError, DatabaseErrorCodes, SearchFilterDataProps } from "@mewi/types"

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
        const user = await UserService.user(userId)
        try {
            user.watchers.pull(this.watcher_id)
        } catch (e) {
            console.log(e.message)
        }
        await user.save()

        // Remove user from watcher
        const watcher = await this.watcher()
        if (!watcher) return

        watcher.users = watcher.users.filter(uid => uid.toString() !== userId)

        console.log(watcher.users)

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

    static async findSimilarWatcher(query, projection = {}) {
        return await WatcherModel.findOne({ query }, projection)
    }

    static async create(metadata: SearchFilterDataProps, query) {

        const isValidQuery = await SearchService.validateQuery(query)

        if (!isValidQuery) throw new APIError(422, WatcherErrorCodes.INVALID_QUERY)

        const similarWatcher = await this.findSimilarWatcher(query)

        if (!similarWatcher) {

            console.log(`No similar watcher found. Creating a new watcher...`)

            // Create new watcher
            const newWatcher = await WatcherModel.create({
                metadata,
                query
            })

            return newWatcher
        } else {
            console.log(`Found similar watcher ${similarWatcher._id} returning existing watcher...`)
            throw new APIError(409, DatabaseErrorCodes.CONFLICTING_RESOURCE, "The query already exists on a watcher. The query must be unique.")
        }

    }

    static async isUserInWatcherWithQuery(userId: string, query) {
        const similarWatcher = await WatcherService.findSimilarWatcher(query, { users: 1 })

        if (!similarWatcher) return false

        const userInWatcher = similarWatcher.users.find(x => x.toString() === userId)

        return !!userInWatcher
    }
}