import { Category } from './enums/category.enum'
import { Currency } from './enums/currency.enum'
import { ListingOrigin } from './enums/listing-origin.enum'
import { IEntity } from './IEntity'

export interface IListing extends IEntity {
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
