import {
    ListingModel,
    User,
    UserWatcher,
    UserWatcherModel,
    Watcher,
    WatcherModel,
} from "@mewi/entities";
import {FilteringService} from "@mewi/business";
import {EmailTemplate} from "@mewi/models";
import {EJSON} from "bson";
import {MessageBroker, MQQueues, SendEmailDto} from "@mewi/mqlib";

export class WatchersNotificationService {
    private readonly config = {
        notifications: {
            interval:
                process.env.NODE_ENV === "development" ? 0 : 2.5 * 24 * 60 * 60 * 1000,
            listingsToShow: 7,
            minListings: 1,
        },
    };

    private readonly filteringService: FilteringService;
    private readonly messageBroker: MessageBroker;

    constructor(
        filteringService: FilteringService,
        messageBroker: MessageBroker
    ) {
        this.filteringService = filteringService;
        this.messageBroker = messageBroker;
    }

    public async notifyAll(): Promise<void> {
        let usersNotified = 0;
        const start = Date.now();
        /**
         * Streaming query results to reduce memory usage potentially (?)
         */
        for await (const watcher of WatcherModel.find()) {
            usersNotified += await this.notifyUsers(watcher);
        }

        const elapsedTime = (Date.now() - start) / 1000;
        console.log(`Notified ${usersNotified} users after ${elapsedTime}s`);
    }

    /**
     * Notify all users that subscribes to a watcher
     * @param watcher - {@link Watcher}
     * @private
     * @return number - number of users that were notified
     */
    private async notifyUsers(watcher: Watcher): Promise<number> {
        let usersNotified = 0;

        for await (const userWatcher of UserWatcherModel.find({watcher: watcher})
            .populate("watcher")
            .populate("user")) {
            if (await this.notifyUser(userWatcher)) {
                usersNotified++;
            }
        }

        return usersNotified;
    }

    /**
     * Notify a user of watcher
     * @param userWatcher - {@link UserWatcher}
     * @returns true if user was notified, else false
     */
    private async notifyUser(userWatcher: UserWatcher): Promise<boolean> {
        const watcher = userWatcher.watcher as Watcher;
        const user = userWatcher.user as User;

        const pipeline = this.filteringService.convertToPipeline(watcher.metadata);
        const newListings = await this.newListings(pipeline);

        if (
            newListings.length < this.config.notifications.minListings ||
            !(await this.shouldNotifyUser(userWatcher))
        ) {
            return false;
        }

        const locals = await this.getNotificationEmailLocals(watcher, newListings);

        const sendEmailDto = new SendEmailDto();
        sendEmailDto.userId = user.id;
        sendEmailDto.locals = locals;
        sendEmailDto.userEmail = user.email;
        sendEmailDto.subject = "Nya begagnade annonser";
        sendEmailDto.emailTemplate = EmailTemplate.NEW_ITEMS;
        await this.messageBroker.sendMessage(MQQueues.SendEmail, sendEmailDto);

        // Update notifiedAt property of user watcher
        await UserWatcherModel.findOneAndUpdate(
            {
                userId: user.id,
                watcherId: watcher.id,
            },
            {
                $set: {
                    notifiedAt: new Date(),
                },
            }
        );

        return true;
    }

    private async getNotificationEmailLocals(
        watcher: Watcher,
        newListings: any[]
    ) {
        return {
            listingsToShow: await ListingModel.aggregate([
                ...this.filteringService.convertToPipeline(watcher.metadata as any),
                {$count: "totalHits"},
            ]).then((res) => (res as any)[0]?.totalHits ?? 0),
            filters: watcher.metadata,
            listings: newListings,
        };
    }

    private async shouldNotifyUser(userWatcher: UserWatcher) {
        return (
            Date.now() -
            new Date(userWatcher.notifiedAt ?? userWatcher.createdAt).getTime() >=
            this.config.notifications.interval
        );
    }

    private async newListings(pipeline: any) {
        return await ListingModel.aggregate([...pipeline, {$limit: 7}]).then(
            (arr: any) => (arr as unknown as any[]).map((x) => EJSON.deserialize(x))
        );
    }
}