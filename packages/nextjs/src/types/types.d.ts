import { store } from '@/store'

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export interface ValidatorMessage {
    location: string
    msg: string
    param: string
}

// export interface WatcherMetadata {
//     keyword: string,
//     regions?: string[] | null,
//     category?: string | null,
//     isAuction?: boolean | null,
//     priceRange?: {
//         gte?: string,
//         lte?: string
//     }
// }

export interface FilterStates {
    regionState: { state: string; setState: any }
    categoryState: { state: string; setState: any }
    auctionState: { state: string; setState: any }
    priceRangeState: { state: string; setState: any }
    queryState?: { state: string; setState: any }
}

export type Parameters<T> = T extends (...args: infer T) => any ? T : never

declare global {
    interface Window {
        Cypress?: any
        store: typeof store
    }
}

export interface ValidationError {
    target: Record<string, any>
    property: string
    children: Array<any>
    constraints: Record<string, string>
}

export interface ApiErrorResponse {
    statusCode: number
    message: ValidationError[]
    error: string
}

export type PromiseResolvedType<T> = Awaited<ReturnType<T>>
