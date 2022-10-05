import { IListing } from '@wille430/common'
import { ResourceType } from '..'

export interface ListingsState {
    opened?: IListing
    featured: IListing[]
    search: ResourceType & {
        hits: IListing[] | null
        totalHits: number
    }
}

export enum ListingsActionTypes {
    OPEN_LISTING = 'listings/open',
    CLOSE_LISTING = 'listings/close',
    SET_FEATURED = 'listings/set-featured',
    LIKE = 'listings/like',
    UNLIKE = 'listings/unlike',
    FETCH_SEARCH = 'listings/search',
}
