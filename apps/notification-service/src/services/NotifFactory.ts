import {MailNotification, WatcherNotifStrategy} from "./MailNotification";
import {MessageBroker} from "@mewi/mqlib";
import {UserWatcher} from "@mewi/entities";
import {ListingDto} from "@mewi/models";

export class NotifFactory {

    constructor(private readonly messageBroker: MessageBroker) {
    }

    public createNotif(
        userWatcher: UserWatcher,
        listings: ListingDto[],
        totalListings: number
    ): WatcherNotifStrategy {
        const strategy = new MailNotification(
            this.messageBroker,
            userWatcher,
            listings,
            totalListings
        );

        return strategy;
    }
}