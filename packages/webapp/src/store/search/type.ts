import { ItemData, SearchFilterDataProps, SortData } from '@mewi/types'

export interface SearchState {
    hits: ItemData[]
    totalHits: number
    filters: SearchFilterDataProps
    isLoading: boolean
    sort: SortData
}

export enum SearchActionTypes {
    CLEAR_FILTERS = 'search/clearFilters',
    SET_FILTERS = 'search/setFilters',
    UPDATE_FILTERS = 'search/updateFilters',
    GET_RESULTS = 'search/get',
    SORT = 'search/sort',
}
