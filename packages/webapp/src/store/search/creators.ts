import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getSearchResultsReturnType } from 'api/searchApi'
import { RootState } from 'store'
import { SearchActionTypes } from './type'
import queryString from 'query-string'
import _ from 'lodash'
import axios from 'axios'
import { ListingSearchFilters, Sort } from '@wille430/common'
import { LOCATION_CHANGE } from 'connected-react-router'
import { Listing } from '@prisma/client'

export const updateSearchParams = createAsyncThunk(
    SearchActionTypes.UPDATE_SEARCH_PARAMS,
    async (args, thunkApi) => {
        const state = thunkApi.getState() as RootState
        const { filters } = state.search

        return {
            filters,
        }
    }
)

export const clearFilters = createAction(
    SearchActionTypes.CLEAR_FILTERS,
    (filtersToKeep?: Partial<ListingSearchFilters>) => {
        return {
            payload: filtersToKeep,
        }
    }
)

export const setFilters = createAction(
    SearchActionTypes.SET_FILTERS,
    (filters: ListingSearchFilters) => {
        return { payload: filters }
    }
)

export const updateFilters = createAction(
    SearchActionTypes.UPDATE_FILTERS,
    (filters: Partial<ListingSearchFilters>) => {
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
        const { filters: _filters } = thunkApi.getState().search
        let filters = _filters

        if (filters.keyword === '') filters = _.omit(filters, 'keyword')

        const { totalHits, hits } = await axios
            .get('/listings?' + queryString.stringify({ ...filters }))
            .then((res) => res.data)

        return { totalHits, hits }
    } catch (e) {
        return thunkApi.rejectWithValue(e)
    }
})

export const setSort = createAction(SearchActionTypes.SORT, (sort: Sort) => {
    return { payload: sort }
})

export const getFiltersFromQueryParams = createAction(
    SearchActionTypes.FILTERS_FROM_PARAMS,
    (defaultValues?: Partial<ListingSearchFilters>) => {
        const params = queryString.parse(window.location.search)

        let filters: ListingSearchFilters = {}
        Object.keys(params).forEach((key) => {
            switch (key as keyof ListingSearchFilters) {
                case 'auction':
                    if (params[key] === 'true') {
                        filters = _.merge(filters, { [key]: true })
                    } else {
                        filters = _.omit(filters, key)
                    }
                    break
                case 'page':
                    filters = _.merge(filters, {
                        [key]: Math.max(parseInt(params[key] as string), 0),
                    })
                    break
                default:
                    filters = _.merge(filters, { [key]: params[key] })
            }
        })

        if (defaultValues) {
            return {
                payload: {
                    filters: {
                        ...filters,
                        ...defaultValues,
                    },
                },
            }
        } else {
            return {
                payload: {
                    filters,
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

export const openListing = createAction(SearchActionTypes.OPEN_LISTING, (listing: Listing) => ({
    payload: listing,
}))

export const closeListing = createAction(SearchActionTypes.CLOSE_LISTING)

export const locationChange = createAction(LOCATION_CHANGE)
