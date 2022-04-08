import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import {
    clearFilters,
    clearSearchResults,
    closeListing,
    getFiltersFromQueryParams,
    getSearchResults,
    goToPage,
    locationChange,
    openListing,
    setFilters,
    setSort,
    updateFilters,
    updateSearchParams,
} from './creators'
import { SearchState } from './type'
import queryString from 'query-string'
import { Sort } from '@wille430/common'

const initialState: SearchState = {
    hits: [],
    totalHits: 0,
    filters: {
        sort: Sort.RELEVANCE,
        page: 1,
    },
    searchParams: '',
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSearchResults.fulfilled, (state, action) => {
            state.hits = action.payload.hits
            state.totalHits = action.payload.totalHits
        })

        builder.addCase(clearFilters, (state, action) => {
            if (action.payload) {
                state.filters = {
                    ...initialState.filters,
                    ...action.payload,
                }
            } else {
                state.filters = initialState.filters
            }
        })

        builder.addCase(setFilters, (state, action) => {
            state.filters = action.payload
            state.filters.page = 1
        })

        builder.addCase(updateFilters, (state, action) => {
            let key: keyof typeof action.payload

            for (key in action.payload) {
                // skip if values are the same
                if (action.payload[key] === state.filters[key]) {
                    continue
                }

                // remove from filters if undefined
                if (action.payload[key] == null) {
                    state.filters = _.omit(state.filters, key)
                } else {
                    // otherwise, set val
                    state.filters = _.set(state.filters, key, action.payload[key])
                }
            }
        })

        builder.addCase(setSort, (state, action) => {
            state.filters.sort = action.payload
            state.filters.page = 1
        })

        builder.addCase(getFiltersFromQueryParams, (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload.filters,
            }
        })

        builder.addCase(goToPage, (state, action) => {
            state.filters.page = action.payload
        })

        builder.addCase(clearSearchResults, (state) => {
            state.hits = []
            state.totalHits = 0
        })

        builder.addCase(updateSearchParams.fulfilled, (state, action) => {
            const { filters } = action.payload

            if (filters.keyword) {
                document.title = `Sökning för "${filters.keyword}" - Mewi`
            } else {
                document.title = 'Sök - Mewi.se'
            }

            const keysToEmit = ['category']

            if (!filters.auction) keysToEmit.push('auction')

            const searchParams = _.omit(
                {
                    ...filters,
                    page: filters.page > 1 ? filters.page : undefined,
                    sort: filters.sort !== Sort.RELEVANCE ? filters.sort : undefined,
                },
                keysToEmit
            )

            // update url search params
            state.searchParams = '?' + queryString.stringify(searchParams)
        })

        builder.addCase(openListing, (state, action) => {
            state.selectedListing = action.payload
        })

        builder.addCase(closeListing, (state) => {
            state.selectedListing = initialState.selectedListing
        })

        builder.addCase(locationChange, (state) => {
            state.selectedListing = initialState.selectedListing
        })
    },
})

export default searchSlice.reducer
