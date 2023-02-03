import {Category, Currency, ListingOrigin} from "@/common/schemas"

export interface ListingDto {
    id: string
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
}