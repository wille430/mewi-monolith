import { ItemData, SearchFilterDataProps, SortData } from '@mewi/types'

export interface SearchState {
    hits: ItemData[]
    totalHits: number
    filters: SearchFilterDataProps
    sort: SortData
    page: number
    status: {
        searching: 'complete' | 'loading' | 'error'
    }
}

export enum SearchActionTypes {
    CLEAR_FILTERS = 'search/clearFilters',
    SET_FILTERS = 'search/setFilters',
    UPDATE_FILTERS = 'search/updateFilters',
    GET_RESULTS = 'search/get',
    SORT = 'search/sort',
    FILTERS_FROM_PARAMS = 'search/filtersFromParams',
    SET_PAGE = 'search/setPage',
}
