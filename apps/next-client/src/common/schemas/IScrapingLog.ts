import {ListingOrigin} from "@mewi/models";

export interface IScrapingLog {
    id: string
    addedCount: number

    // Properties used to identify when to stop scraping next time
    entryPoint: string
    scrapeToId?: string
    scrapeToDate?: Date

    origin: ListingOrigin
    createdAt: Date
    updatedAt: Date
}
