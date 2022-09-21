import { Listing } from '@mewi/prisma/index-browser'
import { ResourceType } from '..'

export interface ListingsState {
    opened?: Listing
    featured: Listing[]
    search: ResourceType & {
        hits: Listing[] | null
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
