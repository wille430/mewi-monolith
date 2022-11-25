export interface ScraperStatusReport {
    listings_remaining: number
    listings_current: number
    last_scraped?: Date
}

export enum ScraperStatus {
    SCRAPING = 'SCRAPING',
    QUEUED = 'QUEUED',
    IDLE = 'IDLE',
}
