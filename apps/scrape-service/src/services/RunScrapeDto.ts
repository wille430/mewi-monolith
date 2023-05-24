import { ListingOrigin } from "@mewi/models";

export class RunScrapeDto {
  origin?: ListingOrigin;
  endpoint?: string;
  scrapeAmount?: number = 40;
}

export interface GenericScrapeArgs {
  scrapeAmount?: number;
}

export interface ScrapeByIdArgs extends GenericScrapeArgs {
  origin: ListingOrigin;
  configId: string;
}

export interface ScrapeByOriginArgs extends GenericScrapeArgs {
  origin: ListingOrigin;
}

export interface ScrapeAllArgs extends GenericScrapeArgs {
  scrapeAmount: number
}
