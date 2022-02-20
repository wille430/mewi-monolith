import { ItemData, PublicWatcher, WatcherMetadata } from '@mewi/types'
import { toDateObj, toUnixTime } from '@mewi/util'
import Elasticsearch, { elasticClient } from 'config/elasticsearch'
import { User } from 'models/UserModel'
import EmailService from './EmailService'
import SearchService from './SearchService'
import { UserService } from './UserServices'
import WatcherService from './WatcherService'

class WatcherNotificationService {
    client = elasticClient

    constructor(client?: typeof elasticClient) {
        this.client = client || elasticClient
    }

    /**
     * Notify all users who are subscribed to the watcher
     * @param watcher PublicWatcher
     * @param callback Called after each user is notified
     */
    async notifyUsersOfWatcher(watcher: PublicWatcher, callback?: () => void) {
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
     * @param watcher PublicWatcher
     * @param callback Called after user is notified
     * @returns {Promise<void>}
     */
    async notifyUser(user: User, watcher: PublicWatcher, callback?: () => void): Promise<void> {
        // Get UserWatcher of user
        const watcherInUser = user.watchers.id(watcher._id)

        if (!watcherInUser) {
            await new WatcherService(watcher._id).delete(user._id)
            return
        }
        if (!this.userShouldBeNotified(watcherInUser.notifiedAt)) return

        const dateAdded = Date.parse(watcherInUser.createdAt)

        const lastNotificationDate = watcherInUser.notifiedAt
            ? toUnixTime(watcherInUser.notifiedAt)
            : null

        let comparationDate = dateAdded
        if (lastNotificationDate) comparationDate = lastNotificationDate

        const { newItems, totalHits } = await this.getNewItemsSince(
            watcher.metadata,
            comparationDate
        )

        if (newItems.length <= 0) return

        console.log(
            `Found ${newItems.length} new items for user ${user.email} since ${toDateObj(
                comparationDate
            ).toDateString()} (watcher_id: ${watcherInUser._id})`
        )

        // send email
        await EmailService.sendEmailWithItems(user.email, watcher, newItems, totalHits)

        callback && callback()

        // Update date when last notified in user watcher
        watcherInUser.set({
            ...watcherInUser,
            notififedAt: new Date(Date.now()),
        })

        await user.save()
        console.log(`${user.email} was successully notified!`)
    }

    async notifyUsers() {
        // Iterate through every watcher in mongodb
        const watchers = await WatcherService.getAll()

        // Count emails sent to users
        let mailSent = 0

        watchers.forEach(async (watcher) => {
            await this.notifyUsersOfWatcher(watcher, () => (mailSent += 1))
        })

        console.log(`${mailSent} emails were sent!`)
    }
    i

    userShouldBeNotified(lastNotificationDate: Date): boolean {
        if (!lastNotificationDate) return true

        const ms = toUnixTime(lastNotificationDate)
        if (Date.now() - ms > 24 * 60 * 60 * 1000) return true

        return false
    }

    /**
     * Find items added since a certain date
     * @param {WatcherMetadata} metadata Find items matching this query
     * @param {number} sinceDate Unix time
     * @return Object with an array of ItemData and totalHits
     */
    async getNewItemsSince(metadata: WatcherMetadata, sinceDate: number) {
        const elasticQuery = SearchService.createElasticQuery(metadata)

        // Modify query to include range for date > comparationDate
        elasticQuery.bool.must.push({ range: { date: { gte: sinceDate } } })

        // Get new items for since date
        const response = await this.client.search({
            index: Elasticsearch.defaultIndex,
            body: {
                query: elasticQuery,
                size: 5,
                sort: [{ date: 'desc' }],
            },
        })

        const newItems: ItemData[] = response.body.hits.hits.map((x) => x._source)

        return {
            newItems,
            totalHits: response.body.hits.total.value,
        }
    }
}

export default WatcherNotificationService
