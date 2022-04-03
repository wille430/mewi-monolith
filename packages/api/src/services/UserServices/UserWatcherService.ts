/**
 * @module UserWatcherService
 */

import { Types } from 'bson'
import { DatabaseErrorCodes, JoinedWatcher, Types.ListingSearchFilters } from '@mewi/common'
import WatcherModel from 'models/WatcherModel'
import WatcherService from 'services/WatcherService'
import { UserService } from './index'
import SearchService from 'services/SearchService'
import { Watcher } from 'models/UserModel'

class UserWatcherService {
    /**
     *
     * @param userId User ID
     * @returns Array of watchers
     */
    static async getAll(userId: string): Promise<JoinedWatcher[]> {
        const user = await UserService.userById(userId)
        const userWatchers = user.watchers

        const watchers: JoinedWatcher[] = await Promise.all(
            userWatchers.map(async (userWatcher: Watcher) => {
                try {
                    const publicWatcher = await WatcherModel.findById(userWatcher._id)

                    const joinedWatcher: JoinedWatcher = {
                        ...userWatcher.toObject(),
                        metadata: publicWatcher.metadata,
                        _id: userWatcher._id.toString(),
                    }

                    return joinedWatcher
                } catch (e) {
                    console.log(e)
                }
            })
        )

        return watchers
    }

    /**
     *
     * @param userId User ID
     * @param watcherId ID of watcher
     * @returns A user watcher
     */
    static async get(userId: string, watcherId: string): Promise<JoinedWatcher> {
        const user = await UserService.userById(userId)
        const userWatcher = user.watchers.id(watcherId)
        const publicWatcher = await WatcherModel.findById(watcherId)

        return {
            _id: new Types.ObjectId(userWatcher._id),
            ...userWatcher.toJSON(),
            metadata: publicWatcher.metadata,
        }
    }

    static async userEligable(userId: string) {
        const user = await UserService.userById(userId)
        const isPremium = user.premium
        const watcherCount = user.watchers.length

        if (isPremium) {
            return true
        } else {
            return watcherCount < 2
        }
    }

    static async addWatcher(
        userId: string,
        metadata: Types.ListingSearchFilters
    ): Promise<JoinedWatcher> {
        const user = await UserService.userById(userId)
        const similarWatcher = await WatcherModel.findOne({ metadata })

        let watcher: typeof similarWatcher
        if (similarWatcher) {
            watcher = similarWatcher
        } else {
            watcher = await WatcherService.create(metadata)
        }

        const watcherInUser = user.watchers.find(
            (userWatcher) => userWatcher._id.toString() === watcher._id.toString()
        )

        if (!watcherInUser) {
            const userWatcher = user.watchers.create({
                _id: watcher._id,
            })
            user.watchers.push(userWatcher)

            const userIdObject = new ObjectId(userId)

            if (!watcher.users?.includes(userIdObject)) {
                watcher.users = [...(watcher.users || []), userIdObject]
            }

            await watcher.save()
            await user.save()

            console.log('Done. Returning user...')

            return {
                ...watcher.toObject(),
                ...userWatcher.toObject(),
                _id: userWatcher._id.toString(),
            }
        } else {
            console.log('User is already subscribed to the watcher')

            await watcher.save()
            await user.save()

            throw new APIError(
                409,
                DatabaseErrorCodes.CONFLICTING_RESOURCE,
                'The query must be unique.'
            )
        }
    }

    static async updateWatcher(
        userId: string,
        watcherId: string,
        searchFilters: Types.ListingSearchFilters
    ): Promise<JoinedWatcher> {
        const query = SearchService.createDbFilters(searchFilters)
        const similarWatcher = await WatcherModel.findOne({ metadata: searchFilters })

        let watcher: typeof similarWatcher
        if (similarWatcher) {
            console.log('Found similar watcher')
            watcher = similarWatcher
        } else {
            console.log('No similar watcher found. Creating a new watcher...')
            watcher = await WatcherService.create(searchFilters)
        }

        if (!watcher) throw new APIError(404, DatabaseErrorCodes.MISSING_DOCUMENT)

        console.log('Watcher to add:', watcher)

        // remove old watcher and add new
        const user = await UserService.userById(userId)
        user.watchers.pull({ _id: watcherId })

        const newUserWatcher = user.watchers.create({
            _id: watcher._id,
        })
        user.watchers.push(newUserWatcher)

        // Adding user to watcher
        watcher.users = [...watcher.users, new ObjectId(user._id)]

        // save
        await user.save()
        await watcher.save()

        return {
            ...watcher.toObject(),
            ...newUserWatcher.toObject(),
            _id: newUserWatcher._id.toString(),
        }
    }
}

export default UserWatcherService
