import { MessageBroker, MQQueues, SendEmailDto } from "@mewi/mqlib";
import { User, UserWatcher, WatcherMetadata } from "@mewi/entities";
import { isDocument } from "@typegoose/typegoose";
import { EmailTemplate, ListingDto, WatcherMetadataDto } from "@mewi/models";

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
    private readonly messageBroker: MessageBroker,
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
      await this.messageBroker.sendMessage(
        MQQueues.SendEmail,
        this.createSendEmailDto()
      );
    } catch (e) {
      throw new Error(
        `Could not send message to ${MQQueues.SendEmail} message queue. Reason: ${e}`
      );
    }

    this.hasSent = true;
  }

  private createSendEmailDto(): SendEmailDto {
    const sendEmailDto = new SendEmailDto();

    sendEmailDto.userEmail = this.user.email;
    sendEmailDto.userId = this.user.id;
    sendEmailDto.locals = {
      listingCount: this.totalListings,
      filters: this.getFilters(),
      listings: this.listings,
    };
    sendEmailDto.subject = `${this.totalListings} nya annonser matchade din sökning!`;
    sendEmailDto.emailTemplate = EmailTemplate.NEW_ITEMS;

    return sendEmailDto;
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
