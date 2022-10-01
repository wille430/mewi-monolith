import { Category } from './enums/category.enum'
import { Currency } from './enums/currency.enum'
import { ListingOrigin } from './enums/listing-origin.enum'

export interface IListing {
    id: string
    origin_id: string
    title: string
    body?: string
    category: Category
    date: Date
    redirectUrl: string
    imageUrl: string[]
    price?: {
        value: number
        currency: Currency
    }
    region?: string
    parameters?: { label: string; value: string }[]
    origin: ListingOrigin
    isAuction: boolean
    auctionEnd?: Date
    entryPoint?: string
}
