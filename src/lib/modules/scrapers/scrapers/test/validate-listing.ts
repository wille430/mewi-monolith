import { Category, Currency } from '@/common/schemas'
import type { ScrapeContext } from '../../classes/types/ScrapeContext'

const urlRegex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/

export const validateListingTest = (
    listing: any,
    { scraper, entryPoint }: Partial<ScrapeContext> = {}
) => {
    expect(typeof listing.title).toBe('string')

    expect(typeof listing.origin_id).toBe('string')

    if (scraper) {
        expect(listing.origin_id).toMatch(new RegExp(`^(${scraper.origin}-)`))
        expect(listing.origin).toBe(scraper.origin)
    }

    expect(listing.redirectUrl).toMatch(urlRegex)

    expect(Object.keys(Category)).toContain(listing.category)

    if (listing.body) expect(typeof listing.body).toBe('string')

    if (listing.imageUrl) {
        expect(Array.isArray(listing.imageUrl)).toBe(true)

        for (const url of listing.imageUrl as string[]) {
            expect(url).toMatch(urlRegex)
        }
    }

    if (listing.isAuction !== undefined) expect(typeof listing.isAuction).toBe('boolean')

    if (listing.price) {
        expect(typeof listing.price).toBe('object')
        expect(Object.keys(Currency)).toContain(listing.price.currency)
        expect(typeof listing.price.value).toBe('number')
    }

    if (entryPoint) {
        expect(listing.entryPoint).toBe(entryPoint.identifier)
    }
}
