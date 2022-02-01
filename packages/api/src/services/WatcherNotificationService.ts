import { ItemData } from '@mewi/types'
import { toDateObj, toUnixTime } from '@mewi/util'
import Elasticsearch, { elasticClient } from 'config/elasticsearch'
import EmailService from './EmailService'
import { UserService, UserWatcherService } from './UserServices'
import WatcherService from './WatcherService'

class WatcherNotificationService {
    static async notifyUsers() {
        // Iterate through every watcher in mongodb
        const watchers = await WatcherService.getAll()

        // Count emails sent to users
        let mailSent = 0

        watchers.forEach(async (watcher) => {
            // Get users with corresponding watcher
            const arrayOfUids = watcher.users.map((x) => x.toString())
            const users = await UserService.usersInIds(arrayOfUids)

            users.forEach(async (user) => {

                const watcherInUser = await UserWatcherService.get(user._id, watcher._id)
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

                // Modify query to include range for date > comparationDate
                const userWatcher = watcher
                userWatcher.query.bool.must.push({ range: { date: { gte: comparationDate } } })

                // Get new items for since date
                const response = await elasticClient.search({
                    index: Elasticsearch.defaultIndex,
                    body: {
                        query: userWatcher.query,
                        size: 5,
                        sort: [{ date: 'asc' }],
                    },
                })

                const newItems: ItemData[] = response.body.hits.hits.map((x) => x._source)
                if (newItems.length <= 0) return

                console.log(
                    `Found ${newItems.length} new items for user ${user.email} since ${toDateObj(
                        comparationDate
                    ).toDateString()} (watcher_id: ${watcherInUser._id})`
                )

                const locals = {
                    newItemCount: response.body.hits.total.value,
                    keyword: watcher.metadata.keyword,
                    items: newItems
                }

                // send email
                await EmailService.sendEmail(user.email, 'newItems', locals)

                mailSent += 1

                // Update date when last notified in user watcher
                const userDoc = await UserService.user(user._id)
                userDoc.watchers.id(watcher._id).notifiedAt = new Date(Date.now())
                console.log(userDoc.watchers.id(watcher._id))
                await userDoc.save()
            })
        })

        console.log(`${mailSent} emails were sent!`)
    }

    static userShouldBeNotified(lastNotificationDate: Date): boolean {
        if (!lastNotificationDate) return true

        const ms = toUnixTime(lastNotificationDate)
        if (Date.now() - ms > 24 * 60 * 60 * 1000) return true

        return false
    }
}

export default WatcherNotificationService