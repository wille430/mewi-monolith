
export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export interface ValidatorMessage {
    "location": string,
    "msg": string,
    "param": string
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
    regionState: { state: string, setState: any },
    categoryState: { state: string, setState: any },
    auctionState: { state: string, setState: any },
    priceRangeState: { state: string, setState: any },
    queryState?: { state: string, setState: any }
}