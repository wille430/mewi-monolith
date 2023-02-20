import type { FindAllListingsDto } from "./find-all-listing.dto";
import { ListingDto } from "@mewi/models";

export class FindAllListingsResponse {
  filters!: FindAllListingsDto;
  totalHits!: number;
  hits!: ListingDto[];
}
