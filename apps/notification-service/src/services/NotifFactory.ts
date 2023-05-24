import { MailNotification, WatcherNotifStrategy } from "./MailNotification";
import { UserWatcher } from "@mewi/entities";
import { ListingDto } from "@mewi/models";

export class NotifFactory {
  public createNotif(
    userWatcher: UserWatcher,
    listings: ListingDto[],
    totalListings: number
  ): WatcherNotifStrategy {
    const strategy = new MailNotification(userWatcher, listings, totalListings);

    return strategy;
  }
}
