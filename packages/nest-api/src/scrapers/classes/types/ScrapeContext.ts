import { BaseEntryPoint } from '../BaseEntryPoint'
import { BaseListingScraper } from '../BaseListingScraper'

export type ScrapeContext = {
    entryPoint: BaseEntryPoint
    scraper: BaseListingScraper
}
