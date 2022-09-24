import { createMany } from './createMany'
import { ListingFactory } from './ListingFactory'

export const createScrapedListings = (count = 20) => {
    return createMany(count, ListingFactory.create, {
        date: new Date().toISOString(),
    })
}
