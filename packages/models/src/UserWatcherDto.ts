import { IEntity } from "./IEntity";
import { WatcherDto } from "./WatcherDto";

export interface UserWatcherDto extends IEntity {
  id: string;
  watcher: WatcherDto;
  notifiedAt?: Date;
}