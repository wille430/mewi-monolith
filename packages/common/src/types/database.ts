import { User, UserWatcher } from '@mewi/prisma'
import { Watcher } from 'error'

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

export type ListingPrice = {
    value: number
    currency: string
}

export interface AuthTokens {
    access_token: string
    refresh_token: string
}

export type EditableUserFields = keyof Pick<User, 'email'>

export type PopulatedUserWatcher = UserWatcher & { watcher: Watcher }
