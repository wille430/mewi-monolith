import { User, UserWatcher, WatcherMetadata } from "@mewi/entities";
import { isDocument } from "@typegoose/typegoose";
import { EmailTemplate, ListingDto, WatcherMetadataDto } from "@mewi/models";
import { sendEmailTemplate } from "@mewi/email-templates/dist/src";

export interface WatcherNotifStrategy {
  send(): Promise<void>;
}

export class MailNotification implements WatcherNotifStrategy {
  private readonly userWatcher: UserWatcher;
  private readonly user: User;

  private readonly listings;
  private readonly totalListings;
  private hasSent = false;

  constructor(
    userWatcher: UserWatcher,
    listings: ListingDto[],
    totalListings: number
  ) {
    if (!isDocument(userWatcher.user) || !isDocument(userWatcher.watcher)) {
      throw new Error(
        `Fields of user watcher must be populated with watcher and user.`
      );
    }

    if (totalListings < 0 || totalListings < listings.length) {
      throw new Error(
        "totalListings must be greater or equal to 0 and greater than or equal to the length of listings"
      );
    }

    this.user = userWatcher.user;
    this.userWatcher = userWatcher;
    this.totalListings = totalListings;
    this.listings = listings;
  }

  async send(): Promise<void> {
    if (this.hasSent) {
      throw new Error("Email has already been sent!");
    }

    try {
      await sendEmailTemplate(EmailTemplate.NEW_ITEMS, {
        to: this.user.email,
        locals: {
          listingCount: this.totalListings,
          filters: this.getFilters(),
          listings: this.listings,
          clientUrl: process.env.CLIENT_URL,
        },
        subject: `${this.totalListings} nya annonser matchade din sökning!`,
      });
    } catch (e) {
      throw new Error(`Failed to send email template mail: ${e}`);
    }

    this.hasSent = true;
  }

  private getFilters(): WatcherMetadataDto {
    if (!isDocument(this.userWatcher.watcher)) {
      throw new Error(
        'watcher property in UserWatcher has not been populated. Please use userWatcher.populate("watcher") before calling this method'
      );
    }

    return WatcherMetadata.convertToDto(this.userWatcher.watcher.metadata);
  }
}
