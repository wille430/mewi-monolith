import { createListing } from '@/factories/createListing'
import { Listing } from '@/schemas/listing.schema'

export const MAX_SCRAPE_DURATION = 1000
export const MIN_SCRAPE_DURATION = 800
const LIMIT = 20

const pages: Record<number, Listing[]> = {}

export const EntryPoint = jest.fn().mockReturnValue({
    scrape: jest.fn(async (page) => {
        let listings: Listing[] = pages[page]

        if (!listings) {
            listings = await Promise.all(Array(LIMIT).fill(null).map(createListing))
        }

        return listings
    }),
})
