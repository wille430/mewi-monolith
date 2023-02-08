import { IUser, IUserWatcher, IWatcher } from '../schemas'

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

export type ListingPrice = {
    value: number
    currency: string
}

export interface AuthTokens {
    access_token: string
    refresh_token: string
}

export type EditableUserFields = keyof Pick<IUser, 'email'>

export type PopulatedUserWatcher = IUserWatcher & { watcher: IWatcher }
