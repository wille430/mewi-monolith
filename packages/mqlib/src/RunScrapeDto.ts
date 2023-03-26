import {ListingOrigin} from "@mewi/models"

export class RunScrapeDto {
    origin?: ListingOrigin
    endpoint?: string
    scrapeAmount?: number = 40
}