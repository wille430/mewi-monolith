import { IWatcher, WatcherMetadata } from '@wille430/common'
import { toUnixTime } from '@wille430/common/utils'
import ListingModel from 'models/ListingModel'
import { User } from 'models/UserModel'
import EmailService from './EmailService'
import SearchService from './SearchService'
import { UserService } from './UserServices'
import WatcherService from './WatcherService'

class WatcherNotificationService {
    /**
     * Notify all users who are subscribed to the watcher
     * @param watcher IWatcher
     * @param callback Called after each user is notified
     */
    static async notifyUsersOfWatcher(watcher: IWatcher, callback?: () => void) {
        console.log('Notifying users who are subscribed to watcher', watcher._id)

        // Get users with corresponding watcher
        const arrayOfUids = watcher.users.map((x) => x.toString())
        const users = await UserService.usersInIds(arrayOfUids)

        users.forEach(async (user) => {
            try {
                await this.notifyUser(user, watcher, callback)
            } catch (e) {
                console.error(e)
            }
        })
    }

    /**
     * Notify a user of new items in watcher
     * @param user Mongoose User object
     * @param watcher IWatcher
     * @param callback Called after user is notified
     * @returns {Promise<void>}
     */
    static async notifyUser(user: User, watcher: IWatcher, callback?: () => void): Promise<void> {
        // Get UserWatcher of user
        const watcherInUser = user.watchers.id(watcher._id)

        if (!watcherInUser) {
            await new WatcherService(watcher._id).delete(user._id)
            return
        }
        if (!this.userShouldBeNotified(new Date(watcherInUser.notifiedAt))) return

        const dateAdded = Date.parse(watcherInUser.createdAt)

        const lastNotificationDate = watcherInUser.notifiedAt
            ? toUnixTime(new Date(watcherInUser.notifiedAt))
            : null

        let comparationDate = dateAdded
        if (lastNotificationDate) comparationDate = lastNotificationDate

        const { newItems, totalHits } = await this.getNewItemsSince(
            watcher.metadata,
            comparationDate
        )

        if (newItems.length <= 0) return

        console.log(
            `Found ${newItems.length} new items for user ${user.email} since ${new Date(
                comparationDate
            ).toDateString()} (watcher_id: ${watcherInUser._id})`
        )

        // send email
        await EmailService.sendEmailWithItems(user.email, watcher, newItems, totalHits)

        callback && callback()

        // Update date when last notified in user watcher
        watcherInUser.notifiedAt = new Date().toString()

        await user.save()
        console.log(`${user.email} was successully notified!`)
    }

    static async notifyUsers() {
        // Iterate through every watcher in mongodb
        const watchers = await WatcherService.getAll()

        // Count emails sent to users
        let mailSent = 0

        watchers.forEach(async (watcher) => {
            await this.notifyUsersOfWatcher(watcher, () => (mailSent += 1))
        })

        console.log(`${mailSent} emails were sent!`)
    }

    static userShouldBeNotified(lastNotificationDate: Date): boolean {
        if (!lastNotificationDate) return true

        const ms = toUnixTime(lastNotificationDate)
        if (Date.now() - ms > 1.5 * 24 * 60 * 60 * 1000) return true

        return false
    }

    /**
     * Find items added since a certain date
     * @param {WatcherMetadata} metadata Find items matching this query
     * @param {number} sinceDate Unix time
     * @return Object with an array of ItemData and totalHits
     */
    static async getNewItemsSince(metadata: WatcherMetadata, sinceDate: number) {
        const filterQuery = SearchService.createDbFilters(metadata)

        // Modify query to include range for date > comparationDate
        if (filterQuery.$and) {
            filterQuery.$and.push({ date: { $gte: sinceDate } })
        } else {
            filterQuery.$and = [{ date: { $gte: sinceDate } }]
        }

        // Get new items for since date
        const newListings = await ListingModel.find(filterQuery, null, {
            limit: 5,
            sort: { date: -1 },
        }).lean()

        const totalHits = await ListingModel.find(filterQuery).count()

        return {
            newItems: newListings,
            totalHits,
        }
    }
}

export default WatcherNotificationService
