import {MailNotification, WatcherNotifStrategy} from "./MailNotification";
import {MessageBroker} from "@mewi/mqlib";
import {UserWatcher} from "@mewi/entities";
import {ListingDto} from "@mewi/models";

export class NotifFactory {
    public createNotif(
        userWatcher: UserWatcher,
        listings: ListingDto[],
        totalListings: number
    ): WatcherNotifStrategy {
        const strategy = new MailNotification(
            new MessageBroker(process.env.MQ_CONNECTION_STRING),
            userWatcher,
            listings,
            totalListings
        );

        return strategy;
    }
}