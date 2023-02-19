import { ListingDto } from "./ListingDto";
import { UserWatcherDto } from "./UserWatcherDto";

export interface DetailedUserWatcherDto extends UserWatcherDto {
  newListings: ListingDto[];
}
