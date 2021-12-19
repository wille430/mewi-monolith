
/**
 * @module UserWatcherService
 */

import { ObjectId } from "bson"
import { APIError, DatabaseErrorCodes } from "types/errorCodes"
import WatcherModel, { PublicWatcher } from "models/WatcherModel"
import WatcherService from "services/WatcherService"
import { UserService } from "./index"

class UserWatcherService {

    /**
     * 
     * @param userId User ID
     * @returns Array of watchers
     */
    static async getAll(userId: string) {
        const user = await UserService.user(userId)
        const userWatchers = user.watchers

        const watchers = await Promise.all(userWatchers.map(async (userWatcher) => {
            return await WatcherModel.findById(userWatcher._id)
        }))

        return watchers
    }

    /**
     * 
     * @param userId User ID
     * @param watcherId ID of watcher
     * @returns A user watcher
     */
    static async get(userId: string, watcherId: string) {
        const user = await UserService.user(userId)

        return user.watchers.id(watcherId)
    }


    static async userEligable(userId: string) {
        const user = await UserService.user(userId)
        const isPremium = user.premium
        const watcherCount = user.watchers.length

        if (isPremium) {
            return true
        } else {
            return watcherCount < 2
        }
    }

    static async addWatcher(userId: string, { metadata, query }: PublicWatcher["metadata"] & PublicWatcher["query"]) {

        const user = await UserService.user(userId)

        const similarWatcher = await WatcherService.findSimilarWatcher(query)

        let watcher: typeof similarWatcher
        if (similarWatcher) {
            console.log('Found similar watcher')
            watcher = similarWatcher
        } else {
            console.log('No similar watcher found. Creating a new watcher...')
            watcher = await WatcherService.create(metadata, query)
        }

        const watcherInUser = user.watchers.find(userWatcher => userWatcher._id.toString() === watcher._id.toString())

        if (!watcherInUser) {
            console.log('User does not subscribe to the watcher. Adding it to user...')

            const userWatcher = user.watchers.create({
                _id: watcher._id
            })
            user.watchers.push(userWatcher)

            const userIdObject = new ObjectId(userId)

            if (!watcher.users?.includes(userIdObject)) {
                watcher.users = [
                    ...(watcher.users || []),
                    userIdObject
                ]
            }

            await watcher.save()
            await user.save()

            console.log('Done. Returning user...')

            return watcher

        } else {

            console.log('User is already subscribed to the watcher')

            await watcher.save()
            await user.save()

            throw new APIError(409, DatabaseErrorCodes.CONFLICTING_RESOURCE, "The query must be unique.")
        }

    }

    static async updateWatcher(userId: string, watcherId: string, { query, metadata }) {

        const similarWatcher = await WatcherService.findSimilarWatcher(query)

        let watcher: typeof similarWatcher
        if (similarWatcher) {
            console.log('Found similar watcher')
            watcher = similarWatcher
        } else {
            console.log('No similar watcher found. Creating a new watcher...')
            watcher = await WatcherService.create(metadata, query)
        }

        if (!watcher) throw new APIError(404, DatabaseErrorCodes.MISSING_DOCUMENT)

        console.log('Watcher to add:', watcher)

        // remove old watcher and add new
        const user = await UserService.user(userId)
        user.watchers.pull({ _id: watcherId })

        const newUserWatcher = user.watchers.create({
            _id: watcher._id
        })
        user.watchers.push(newUserWatcher)

        // Adding user to watcher
        watcher.users = [
            ...watcher.users,
            new ObjectId(user._id)
        ] 

        // save
        await user.save()
        await watcher.save()

        return watcher
    }
}

export default UserWatcherService