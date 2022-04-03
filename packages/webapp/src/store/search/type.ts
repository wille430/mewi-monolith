import { IListing, ListingSearchFilters } from '@mewi/common/types'
import { getSearchResultsReturnType } from 'api'

export interface SearchState {
    hits: getSearchResultsReturnType['hits']
    totalHits: number
    filters: ListingSearchFilters
    searchParams: string
    selectedListing?: IListing
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
    OPEN_LISTING = 'search/listing/set',
    CLOSE_LISTING = 'search/listing/clear',
}
