import { ScrapingLog } from '../../schemas/scraping-log.schema'

export class ScrapeNextResult {
    totalCount!: number
    scrapingLog!: ScrapingLog
}
