import type { ResourceType } from '../index'
import {ListingDto} from "@mewi/models"

export interface ListingsState {
    opened?: ListingDto
    search: ResourceType & {
        hits: ListingDto[] | null
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
