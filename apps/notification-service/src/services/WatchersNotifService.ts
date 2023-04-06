import {
  Listing,
  ListingModel,
  UserWatcher,
  UserWatcherDocument,
  UserWatcherModel,
  Watcher,
  WatcherMetadata,
  WatcherModel,
} from "@mewi/entities";
import {FilteringService} from "@mewi/business";
import {ListingDto, ListingSort} from "@mewi/models";
import * as winston from "winston";
import {isDocument} from "@typegoose/typegoose";
import {NotifFactory} from "./NotifFactory";
import {WatcherNotificationConfig} from "./WatcherNotificationConfig"

export class WatchersNotifService {
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
  private readonly notifFactory: NotifFactory;
  private readonly config: WatcherNotificationConfig;

  constructor(filteringService: FilteringService, notifFactory: NotifFactory, config: WatcherNotificationConfig = new WatcherNotificationConfig()) {
    this.filteringService = filteringService;
    this.notifFactory = notifFactory;
    this.config = config
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
    WatchersNotifService.logger.log({
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

    const filters = WatcherMetadata.convertToDto(watcher.metadata);
    const resultPipeline = this.filteringService.convertToPipeline({
      ...filters,
      sort: ListingSort.DATE_DESC,
      limit: this.config.maxListings,
    });

    const pipeline = this.filteringService.convertToPipeline(filters);
    const totalHitsCount = await ListingModel.aggregate([
      ...pipeline,
      {$count: "totalHits"},
    ]).then((res) => (res as any)[0]?.totalHits ?? 0);

    const listings = await this.aggregateListings(resultPipeline);

    for await (const userWatcher of UserWatcherModel.find({
      watcher: watcher,
    })) {
      if (await this.notifyUser(userWatcher, listings, totalHitsCount)) {
        usersNotified++;
      }
    }

    return usersNotified;
  }

  /**
   * Notify a user of watcher
   * @param userWatcher {@link UserWatcherDocument}
   * @param listings {@link ListingDo}
   * @param listingCount Total hits
   * @returns true if user was notified, else false
   */
  private async notifyUser(
      userWatcher: UserWatcherDocument,
      listings: ListingDto[],
      listingCount: number
  ): Promise<boolean> {
    await userWatcher.populate("watcher");
    await userWatcher.populate("user");

    if (!isDocument(userWatcher.user) || !isDocument(userWatcher.watcher)) {
      throw new Error(
          `Fields of user watcher must be populated with watcher and user.`
      );
    }

    const {watcher, user} = userWatcher;

    const metadata = WatcherMetadata.convertToDto(watcher.metadata);
    WatchersNotifService.logger.info(
        `Notifying ${user.email} of new listings if necessary`,
        {
          userId: user.id,
          watcherId: watcher.id,
          metadata: metadata,
        }
    );

    const filterByDate =
        userWatcher.notifiedAt ??
        userWatcher.updatedAt ??
        userWatcher.createdAt ??
        undefined;
    let newListings = listings;
    if (filterByDate) {
      newListings = listings.filter((o) => o.date > filterByDate);
    }

    const tooFewListings =
        newListings.length < this.config.minListings;
    const shouldNotify = await this.shouldNotifyUser(userWatcher);
    if (tooFewListings || !shouldNotify) {
      WatchersNotifService.logger.info(
          `${user.email} should not be notified.`,
          {
            tooFewListings,
            tooSoon: !shouldNotify,
          }
      );
      return false;
    }

    const notification = this.notifFactory.createNotif(
        userWatcher,
        newListings,
        listingCount
    );
    try {
      await notification.send();
    } catch (e) {
      WatchersNotifService.logger.error("Failed to send notification", {
        error: e,
      });
      return false;
    }

    WatchersNotifService.logger.info("User notified", {
      userId: user.id,
      userWatcherId: userWatcher.id,
    });

    // Update notifiedAt property of user watcher
    const oldNotifiedAt = userWatcher.notifiedAt;
    userWatcher.notifiedAt = new Date();
    await userWatcher.save();

    WatchersNotifService.logger.info(
        `Updated user watcher (id=${
            userWatcher.id
        }). From notifiedAt ${oldNotifiedAt?.toISOString()} to ${userWatcher.notifiedAt.toISOString()}`
    );

    return true;
  }

  private async shouldNotifyUser(userWatcher: UserWatcher) {
    return (
        Date.now() -
        new Date(userWatcher.notifiedAt ?? userWatcher.createdAt).getTime() >=
        this.config.notifInterval
    );
  }

  private async aggregateListings(pipeline: any) {
    return await ListingModel.aggregate([...pipeline, {$limit: 7}]).then(
        (arr: any) =>
            (arr as unknown as any[]).map((x) => Listing.convertToDto(x))
    );
  }
}