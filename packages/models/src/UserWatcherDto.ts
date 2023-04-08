import { IEntity } from "./IEntity";
import { WatcherDto } from "./WatcherDto";

export enum NotifInterval {
  DAILY,
  DEFAULT,
  BIWEEKLY,
  WEEKLY,
  MONTHLY,
}

export interface UserWatcherOptionsDto {
  notifInterval: NotifInterval;
}

export interface UserWatcherDto extends IEntity {
  id: string;
  watcher: WatcherDto;
  notifiedAt?: Date;
  options: UserWatcherOptionsDto;
}