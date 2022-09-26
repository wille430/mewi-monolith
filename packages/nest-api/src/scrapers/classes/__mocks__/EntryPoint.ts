import { BaseEntryPoint } from '../BaseEntryPoint'
import { ScrapeOptions } from '../types/ScrapeOptions'
import { ScrapeResult } from '../types/ScrapeResult'
import { Listing } from '@mewi/prisma'
import { ListingFactory } from '@mewi/test-utils'
import faker from '@faker-js/faker'

export const MAX_SCRAPE_DURATION = 1000
export const MIN_SCRAPE_DURATION = 800

class EntryPointMock extends BaseEntryPoint {
    private pages: Record<number, Listing[]> = {}

    async scrape(page: number, options: ScrapeOptions): Promise<ScrapeResult> {
        if (!this.pages[page]) {
            const listings = await Promise.all(
                new Array(this.scraper.limit).fill(null).map(ListingFactory.build)
            )

            this.pages[page] = listings as any
        }

        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, faker.datatype.number({ min: MIN_SCRAPE_DURATION, max: MAX_SCRAPE_DURATION }))
        })

        return this.createScrapeResult(undefined, this.pages[page], page, options)
    }
}

export default EntryPointMock
