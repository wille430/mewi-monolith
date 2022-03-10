import { SearchFilterDataProps, SortData } from '@mewi/types'
import { getSearchResultsReturnType } from 'api'

export interface SearchState {
    hits: getSearchResultsReturnType['hits']
    totalHits: number
    filters: SearchFilterDataProps
    sort: SortData
    page: number
    status: {
        searching: 'complete' | 'loading' | 'error'
    }
    searchParams: string
}

export enum SearchActionTypes {
    CLEAR_FILTERS = 'search/clearFilters',
    SET_FILTERS = 'search/setFilters',
    UPDATE_FILTERS = 'search/updateFilters',
    GET_RESULTS = 'search/get',
    SORT = 'search/sort',
    FILTERS_FROM_PARAMS = 'search/filtersFromParams',
    SET_PAGE = 'search/setPage',
    CLEAR_RESULTS = 'search/clear',
    UPDATE_SEARCH_PARAMS = 'search/updateParams',
}
