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
    email: string
    password: string
    premium: boolean
    watchers: UserWatcherData[]
}

export type WatcherMetadata = SearchFilterDataProps

export interface PublicWatcher {
    _id: ObjectId
    query: ElasticQuery
    metadata: WatcherMetadata
    users: ObjectId[]
    createdAt: string
}

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
    _id: string
    title: string
    body?: string
    category: CategoryType
    date?: number
    endDate?: number
    imageUrl: string[]
    isAuction: boolean
    redirectUrl: string
    price?: {
        value: number
        currency: string
    }
    region: string
    zipcode?: string
    parameters?: {
        id: string
        label: string
        value: string
    }[]
    origin: 'Blocket' | 'Tradera' | 'Sellpy' | 'Blipp'
}

export interface AuthTokens {
    jwt: JWT
    refreshToken: string
}
