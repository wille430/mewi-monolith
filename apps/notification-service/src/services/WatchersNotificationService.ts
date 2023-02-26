import {
    ListingModel,
    UserWatcher,
    UserWatcherDocument,
    UserWatcherModel,
    Watcher,
    WatcherMetadata,
    WatcherModel,
} from "@mewi/entities";
import {FilteringService} from "@mewi/business";
import {EmailTemplate} from "@mewi/models";
import {EJSON} from "bson";
import {MessageBroker, MQQueues, SendEmailDto} from "@mewi/mqlib";
import * as winston from "winston";
import {prettyStringify} from "@mewi/utilities";
import {isDocument} from "@typegoose/typegoose";

export class WatchersNotificationService {
    private readonly config = {
        notifications: {
            interval:
                process.env.NODE_ENV === "development" ? 0 : 2.5 * 24 * 60 * 60 * 1000,
            listingsToShow: 7,
            minListings: 1,
        },
    };

    private static readonly logger = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        defaultMeta: {service: "WatcherNotificationService"},
        transports: [
            new winston.transports.File({filename: "error.log", level: "error"}),
            new winston.transports.File({filename: "combined.log"}),
            new winston.transports.Console({
                format: winston.format.simple(),
            }),
        ],
    });

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
        WatchersNotificationService.logger.log({
            level: "info",
            message: `Notified ${usersNotified} users after ${elapsedTime}s`,
        });
    }

    /**
     * Notify all users that subscribes to a watcher
     * @param watcher - {@link Watcher}
     * @private
     * @return number - number of users that were notified
     */
    private async notifyUsers(watcher: Watcher): Promise<number> {
        let usersNotified = 0;

        for await (const userWatcher of UserWatcherModel.find({
            watcher: watcher,
        })) {
            if (await this.notifyUser(userWatcher)) {
                usersNotified++;
            }
        }

        return usersNotified;
    }

    /**
     * Notify a user of watcher
     * @param userWatcher - {@link UserWatcherDocument}
     * @returns true if user was notified, else false
     */
    private async notifyUser(userWatcher: UserWatcherDocument): Promise<boolean> {
        await userWatcher.populate("watcher");
        await userWatcher.populate("user");

        if (!isDocument(userWatcher.user) || !isDocument(userWatcher.watcher)) {
            throw new Error(
                `Fields of user watcher must be populated with watcher and user.`
            );
        }

        const {watcher, user} = userWatcher;

        const pipeline = this.filteringService.convertToPipeline(
            WatcherMetadata.convertToDto(watcher.metadata)
        );
        WatchersNotificationService.logger.info(
            `Notifying ${user.email} of new listings if necessary`,
            {
                userId: user.id,
                watcherId: watcher.id,
                metadata: watcher.metadata,
                aggregationPipeline: pipeline,
            }
        );
        const newListings = await this.aggregateListings(pipeline);

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
        const newWatcher = await UserWatcherModel.findOneAndUpdate(
            {
                userId: user.id,
                watcherId: watcher.id,
            },
            {
                $set: {
                    notifiedAt: new Date().toISOString(),
                },
            }
        );

        WatchersNotificationService.logger.info(
            `Updated user watcher (id=${newWatcher.id}). From (${prettyStringify({
                notifiedAt: watcher.notifiedAt,
            })}) to (${prettyStringify({notifiedAt: watcher.notifiedAt})})`
        );

        return true;
    }

    private async getNotificationEmailLocals(
        watcher: Watcher,
        newListings: any[]
    ) {
        const listingCount = await ListingModel.aggregate([
            ...this.filteringService.convertToPipeline(watcher.metadata as any),
            {$count: "totalHits"},
        ]).then((res) => (res as any)[0]?.totalHits ?? 0);

        const obj = {
            listingCount,
            filters: watcher.metadata,
            listings: newListings,
        };

        WatchersNotificationService.logger.info(
            `Created notification email locals for watcher ${watcher.id} and ${newListings.length} new listings`,
            {
                ...obj,
                listings: obj.listings.map(({id}) => id),
            }
        );

        return obj;
    }

    private async shouldNotifyUser(userWatcher: UserWatcher) {
        return (
            Date.now() -
            new Date(userWatcher.notifiedAt ?? userWatcher.createdAt).getTime() >=
            this.config.notifications.interval
        );
    }

    private async aggregateListings(pipeline: any) {
        return await ListingModel.aggregate([...pipeline, {$limit: 7}]).then(
            (arr: any) => (arr as unknown as any[]).map((x) => EJSON.deserialize(x))
        );
    }
}