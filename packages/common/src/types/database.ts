import { SearchFilterDataProps } from './index'
import { Types } from 'mongoose'

/**
 * Models
 */

export interface IUserWatcher {
    _id: string
    notifiedAt?: string
    createdAt: string
    updatedAt: string
}

export interface IUser {
    _id: string
    email: string
    premium: boolean
    watchers: IUserWatcher[]
}

export interface IWatcher {
    _id: string
    metadata: SearchFilterDataProps
    users: Types.ObjectId[]
    createdAt: string
}

export interface IPopulatedWatcher extends Omit<IWatcher, 'users' | '_id'>, IUserWatcher {}

export type withId<T> = T & { _id: Types.ObjectId }

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
    category: CategoryType
    date?: number
    endDate?: number
    imageUrl: string[]
    isAuction: boolean
    redirectUrl: string
    price?: ListingPrice
    region: string
    zipcode?: string
    parameters?: {
        id: string
        label: string
        value: string
    }[]
    origin: ListingOrigins
}

export type ListingPrice = {
    value: number
    currency: string
}

export interface AuthTokens {
    access_token: string
    refresh_token: string
}

export type EditableUserFields = keyof Pick<IUser, 'email'>

export enum ListingOrigins {
    Blocket = 'Blocket',
    Tradera = 'Tradera',
    Sellpy = 'Sellpy',
    Blipp = 'Blipp',
}
