import { ObjectId } from 'bson'
import { JWT, SearchFilterDataProps } from '..'

/**
 * Models
 */

export interface UserWatcherData {
    _id: string
    notifiedAt?: string
    createdAt: string
    updatedAt: string
}

export interface UserData {
    _id: string
    email: string
    password: string
    premium: boolean
    watchers: UserWatcherData[]
    passwordResetSecret: string
}

export type WatcherMetadata = SearchFilterDataProps

export interface PublicWatcher {
    _id: ObjectId
    metadata: WatcherMetadata
    users: ObjectId[]
    createdAt: string
}

export interface JoinedWatcher extends Omit<PublicWatcher, 'users' | '_id'>, UserWatcherData {}

export type withId<T> = T & { _id: ObjectId }

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

// ELASTICSEARCH

export interface ElasticQuery {
    bool: {
        must: ({ span_or: { clauses: any[] } } | { match: { [key: string]: any } } | any)[]
        filter?: { [key: string]: any }[]
        must_not?: any[]
    }
}

export interface ElasticSearchBody {
    query: ElasticQuery
    size: number
    sort?: { [key: string]: any }[]
    from: number
}

export type CategoryType = string[]

export interface ItemData {
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
    origin: keyof typeof ListingOrigins
}

export type ListingPrice = {
    value: number
    currency: string
}

export interface AuthTokens {
    jwt: JWT
    refreshToken: string
}

export type EditableUserFields = keyof Pick<UserData, 'email'>

export enum ListingOrigins {
    Blocket = 'Blocket',
    Tradera = 'Tradera',
    Sellpy = 'Sellpy',
    Blipp = 'Blipp',
}
