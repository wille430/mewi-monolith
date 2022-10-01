import { Listing } from '@/schemas/listing.schema'

export type ScrapedListing = Omit<Listing, 'id'>
