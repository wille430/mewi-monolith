import {autoInjectable, inject} from "tsyringe"
import {User} from "@/lib/modules/schemas/user.schema"
import {Watcher, WatcherModel} from "@/lib/modules/schemas/watcher.schema"
import {ListingsService} from "@/lib/modules/listings/listings.service"
import {ListingModel} from "@/lib/modules/schemas/listing.schema"
import {EJSON} from "bson"
import {EmailService} from "@/lib/modules/email/email.service"
import {EmailTemplate} from "@/lib/modules/email/enums/email-template.enum"
import {UserWatcher, UserWatcherModel} from "@/lib/modules/schemas/user-watcher.schema"
import {NotifyUsersResult} from "@/lib/modules/watchers/dto/notify-users-result.dto"

@autoInjectable()
export class WatchersNotificationService {

    private startedAt: Date
    // Used to prevent Next.js serverless function to timeout
    private timeoutDurationMs = 8 * 1000

    private readonly config = {
        notifications: {
            interval: process.env.NODE_ENV === 'development' ? 0 : 2.5 * 24 * 60 * 60 * 1000,
            listingCount: 7,
            minListings: 1
        }
    }

    constructor(@inject(ListingsService) private readonly listingsService: ListingsService,
                @inject(EmailService) private readonly emailService: EmailService
    ) {
        this.startedAt = new Date()
    }

    public async notifyAll(): Promise<NotifyUsersResult> {
        const notifyRes = new NotifyUsersResult()
        this.startedAt = new Date()

        /**
         * Streaming query results to reduce memory usage potentially (?)
         */
        for await (const watcher of WatcherModel.find()) {
            const res = await this.notifyUsers(watcher)
            notifyRes.usersNotified += res.usersNotified
            notifyRes.watchersNotified += res.watchersNotified
        }

        return notifyRes
    }

    private async notifyUsers(watcher: Watcher): Promise<NotifyUsersResult> {
        let usersNotified = 0

        for await (const userWatcher of UserWatcherModel.find({watcher: watcher}).populate('watcher').populate('user')) {
            if (Date.now() - this.startedAt.getTime() > this.timeoutDurationMs) {
                break
            }

            if (await this.notifyUser(userWatcher)) {
                usersNotified++
            }
        }

        return {
            usersNotified,
            watchersNotified: 1
        }
    }

    /**
     * Notify a user of watcher
     * @param userWatcher - UserWatcher
     * @returns true if user was notified, else false
     */
    private async notifyUser(userWatcher: UserWatcher): Promise<boolean> {
        const watcher = userWatcher.watcher as Watcher
        const user = userWatcher.user as User

        const pipeline = this.listingsService.metadataToPL(watcher.metadata)
        const newListings = await this.newListings(pipeline)

        if (newListings.length < this.config.notifications.minListings || !(await this.shouldNotifyUser(userWatcher))) {
            return false
        }

        const locals = await this.getNotificationEmailLocals(watcher, newListings)

        await this.emailService.sendEmail(user, "Nya begagnade föremål", locals, EmailTemplate.NEW_ITEMS)

        // Update notifiedAt property of user watcher
        await UserWatcherModel.findOneAndUpdate({
            userId: user.id,
            watcherId: watcher.id
        }, {
            notifiedAt: new Date()
        })

        return true
    }

    private async getNotificationEmailLocals(watcher: Watcher, newListings: any[]) {
        return {
            listingCount: await ListingModel
                .aggregate([
                    ...this.listingsService.metadataToPL(watcher.metadata as any),
                    {$count: 'totalHits'},
                ])
                .then((res) => (res as any)[0]?.totalHits ?? 0),
            filters: watcher.metadata,
            listings: newListings,
        }
    }

    private async shouldNotifyUser(userWatcher: UserWatcher) {
        return Date.now() - new Date(userWatcher.notifiedAt || userWatcher.createdAt).getTime() >=
            this.config.notifications.interval
    }

    private async newListings(pipeline: any) {
        return await ListingModel
            .aggregate([...pipeline, {$limit: 7}])
            .then((arr: any) => (arr as unknown as any[]).map((x) => EJSON.deserialize(x)))
    }
}