import { Category, Prisma, Currency } from '@mewi/prisma'
import { ScrapeContext } from '../classes/types/ScrapeContext'

export const validateListingTest = (
    listing: Prisma.ListingCreateInput,
    { scraper, entryPoint }: ScrapeContext
) => {
    expect(typeof listing.title).toBe('string')

    expect(typeof listing.origin_id).toBe('string')
    expect(listing.origin_id).match(new RegExp(`^(${scraper.origin}-)`))

    expect(listing.origin).toBe(scraper.origin)
    expect(Object.keys(Category)).toContain(listing.category)

    if (listing.body) expect(typeof listing.body).toBe('string')

    if (listing.imageUrl) expect(Array.isArray(listing.imageUrl)).toBe(true)

    if (listing.isAuction !== undefined) expect(typeof listing.isAuction).toBe('boolean')

    if (listing.price) {
        expect(typeof listing.price).toBe('object')
        expect(Object.keys(Currency)).toContain(listing.price.currency)
        expect(typeof listing.price.value).toBe('number')
    }

    expect(listing.entryPoint).toBe(entryPoint.identifier)
}
