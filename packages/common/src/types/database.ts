import { Category, ListingOrigin, User } from '@mewi/prisma'

export interface FilterStates {
    regionState: { state: string; setState: any }
    categoryState: { state: string; setState: any }
    auctionState: { state: string; setState: any }
    priceRangeState: { state: string; setState: any }
    queryState?: { state: string; setState: any }
}

export interface PriceRangeProps {
    lte: string
    gte: string
}

export type CategoryType = string[]

// TODO: export enum Category {}

export interface IListing {
    id: string
    title: string
    body?: string
    category: Category[]
    date: number
    endDate?: number
    imageUrl: string[]
    isAuction: boolean
    redirectUrl: string
    price?: ListingPrice
    region?: string
    parameters: {
        label: string
        value: string
    }[]
    origin: ListingOrigin
}

export type ListingPrice = {
    value: number
    currency: string
}

export interface AuthTokens {
    access_token: string
    refresh_token: string
}

export type EditableUserFields = keyof Pick<User, 'email'>
