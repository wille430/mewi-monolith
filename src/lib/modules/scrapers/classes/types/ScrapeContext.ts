import type { BaseEntryPoint } from '../BaseEntryPoint'
import type { BaseListingScraper } from '../BaseListingScraper'

export type ScrapeContext = {
    entryPoint: BaseEntryPoint
    scraper: BaseListingScraper
}
