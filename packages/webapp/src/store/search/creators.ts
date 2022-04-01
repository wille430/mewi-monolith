import { Types } from '@mewi/common'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getSearchResultsReturnType } from 'api/searchApi'
import { RootState } from 'store'
import { SearchActionTypes, SearchState } from './type'
import queryString from 'query-string'
import _ from 'lodash'
import axios from 'axios'
import { IListing } from '@mewi/common/types'

export const updateSearchParams = createAsyncThunk(
    SearchActionTypes.UPDATE_SEARCH_PARAMS,
    async (args, thunkApi) => {
        const state = thunkApi.getState() as RootState
        const { filters, page, sort } = state.search

        return {
            filters: filters,
            page: page,
            sort: sort,
        }
    }
)

export const clearFilters = createAction(
    SearchActionTypes.CLEAR_FILTERS,
    (filtersToKeep?: Partial<Types.SearchFilterDataProps>) => {
        return {
            payload: filtersToKeep,
        }
    }
)

export const setFilters = createAction(
    SearchActionTypes.SET_FILTERS,
    (filters: Types.SearchFilterDataProps) => {
        return { payload: filters }
    }
)

export const updateFilters = createAction(
    SearchActionTypes.UPDATE_FILTERS,
    (filters: Partial<Types.SearchFilterDataProps>) => {
        return {
            payload: filters,
        }
    }
)

export const getSearchResults = createAsyncThunk<
    getSearchResultsReturnType,
    void,
    { state: RootState }
>(SearchActionTypes.GET_RESULTS, async (args, thunkApi) => {
    try {
        const { filters: _filters, sort, page } = thunkApi.getState().search
        let filters = _filters

        if (filters.keyword === '') filters = _.omit(filters, 'keyword')

        const { totalHits, hits } = await axios
            .get('/listings?' + queryString.stringify({ ...filters, sort, page }))
            .then((res) => res.data)

        return { totalHits, hits }
    } catch (e) {
        return thunkApi.rejectWithValue(e)
    }
})

export const setSort = createAction(SearchActionTypes.SORT, (sortData: Types.SortData) => {
    return { payload: sortData }
})

export const getFiltersFromQueryParams = createAction(
    SearchActionTypes.FILTERS_FROM_PARAMS,
    (
        defaultValues?: Partial<Types.SearchFilterDataProps>
    ): { payload: Pick<SearchState, 'filters' | 'sort' | 'page'> } => {
        const params = queryString.parse(window.location.search)

        let filters: Types.SearchFilterDataProps = {}
        let sort = Types.SortData.RELEVANCE
        let page = 1
        Object.keys(params).forEach((key) => {
            if (['keyword', 'regions', 'auction', 'priceRangeGte', 'priceRangeLte'].includes(key)) {
                switch (key as keyof Types.SearchFilterDataProps) {
                    case 'auction':
                        if (params[key] === 'true') {
                            filters = _.merge(filters, { [key]: true })
                        } else {
                            filters = _.omit(filters, key)
                        }
                        break
                    default:
                        filters = _.merge(filters, { [key]: params[key] })
                }
            } else if (key === 'sort') {
                if (Object.values(Types.SortData).includes(params[key] as Types.SortData)) {
                    sort = params[key] as Types.SortData
                }
            } else if (key === 'page') {
                page = parseInt(params[key] as string)
                if (page <= 0) {
                    page = 1
                }
            }
        })

        if (defaultValues) {
            return {
                payload: {
                    filters: {
                        ...filters,
                        ...defaultValues,
                    },
                    sort,
                    page,
                },
            }
        } else {
            return {
                payload: {
                    filters,
                    sort,
                    page,
                },
            }
        }
    }
)

export const goToPage = createAction(SearchActionTypes.SET_PAGE, (page: number) => {
    return {
        payload: page,
    }
})

export const clearSearchResults = createAction(SearchActionTypes.CLEAR_RESULTS)

export const openListing = createAction(SearchActionTypes.OPEN_LISTING, (listing: IListing) => ({
    payload: listing,
}))

export const closeListing = createAction(SearchActionTypes.CLOSE_LISTING)
