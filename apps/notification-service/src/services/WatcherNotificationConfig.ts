import { UserWatcher } from "@mewi/entities";

export class WatcherNotificationConfig {
  private static readonly TWO_AND_A_HALF_DAYS = 2.5 * 24 * 60 * 60 * 1000;
  /**
   * Time between each notification per {@link UserWatcher}
   */
  notifInterval =
    process.env.NODE_ENV === "development"
      ? 0
      : WatcherNotificationConfig.TWO_AND_A_HALF_DAYS;

  /**
   * Maximum listings to send each notification
   */
  maxListings = 7;

  /**
   * Minimum listings to send each notification
   */
  minListings = 1;
}
