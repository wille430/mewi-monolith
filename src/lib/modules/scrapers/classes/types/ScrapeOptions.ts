export type ScrapeOptions<T = any> = {
    scrapeAmount?: number
    stopAtPredicate?: Parameters<Array<T>['findIndex']>[0]
}
