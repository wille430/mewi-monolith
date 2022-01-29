import Elasticsearch, { elasticClient } from 'config/elasticsearch'
import { UserService } from './UserServices'
import NodeMailer from 'nodemailer'
import { toUnixTime, toDateObj } from '@mewi/util'
import WatcherService from './WatcherService'
import { ItemData } from 'types/types'
import UserWatcherService from './UserServices/UserWatcherService'
import EmailTemplate from 'email-templates'
import path from 'path'

export default class EmailService {
    static googleAuth = {
        email: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASS,
    }

    static newWatchersTemplatePath = path.join(__dirname, '../emails/newItems')

    static async notifyWatchers() {
        // Iterate through every watcher in mongodb
        const watchers = await WatcherService.getAll()

        // Count emails sent to users
        let mailSent = 0

        watchers.forEach(async (watcher) => {
            // Get users with corresponding watcher
            const arrayOfUids = watcher.users.map((x) => x.toString())
            const users = await UserService.usersInIds(arrayOfUids)

            users.forEach(async (user) => {
                // console.log(`Emailing ${user.username} about ${response.body.hits.hits.length} new products`)

                const watcherInUser = await UserWatcherService.get(user._id, watcher._id)
                if (!watcherInUser) {
                    await new WatcherService(watcher._id).delete(user._id)
                    return
                }
                if (!EmailService.userShouldBeNotified(watcherInUser.notifiedAt)) return

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

                // Return if no new items were found since last notice

                await EmailService.sendEmailWithItems(
                    user._id,
                    watcher,
                    newItems,
                    response.body.hits.total.value
                )
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

    /** @params sendEmailWithItems Notify user with {ItemData} */
    static async sendEmailWithItems(userId: string, watcher, items, totalCount?: number) {
        const user = await UserService.user(userId)

        const locals = {
            newItemCount: totalCount || items.length,
            keyword: watcher.metadata.keyword,
            items: items,
        }

        const info = await this.sendEmail(user.email, this.newWatchersTemplatePath, locals)

        console.log('Preview URL: %s', NodeMailer.getTestMessageUrl(info))
    }

    static async sendEmail(to: string, template: string, locals) {
        // let testAccount = await NodeMailer.createTestAccount()

        const transporter = NodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.googleAuth.email,
                pass: this.googleAuth.pass,
            },
        })

        const email = new EmailTemplate({
            message: {
                from: this.googleAuth.email,
            },
            transport: transporter,
        })

        const emailInfo = await email.send({
            template: template,
            message: {
                to: to,
            },
            locals: locals,
        })

        const info = await transporter.sendMail(emailInfo.originalMessage)

        return info
    }

    static userShouldBeNotified(lastNotificationDate: Date): boolean {
        if (!lastNotificationDate) return true

        const ms = toUnixTime(lastNotificationDate)
        if (Date.now() - ms > 24 * 60 * 60 * 1000) return true

        return false
    }
}
