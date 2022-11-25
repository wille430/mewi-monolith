import { ListingOrigin } from './enums/listing-origin.enum'
import { IEntity } from './IEntity'

export interface IScrapingLog extends IEntity {
    id: string
    addedCount: number

    // Properties used to identify when to stop scraping next time
    entryPoint: string
    scrapeToId?: string
    scrapeToDate?: Date

    origin: ListingOrigin
}
