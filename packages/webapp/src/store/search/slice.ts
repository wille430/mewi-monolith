import { Types } from '@mewi/common'
import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import {
    clearFilters,
    clearSearchResults,
    closeListing,
    getFiltersFromQueryParams,
    getSearchResults,
    goToPage,
    openListing,
    setFilters,
    setSort,
    updateFilters,
    updateSearchParams,
} from './creators'
import { SearchState } from './type'
import queryString from 'query-string'
import { SortData } from '@mewi/common/types'

const initialState: SearchState = {
    hits: [],
    totalHits: 0,
    filters: {},
    sort: Types.SortData.RELEVANCE,
    page: 1,
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

            state.sort = initialState.sort
            state.page = 1
        })

        builder.addCase(setFilters, (state, action) => {
            state.filters = action.payload
            state.page = 1
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
            state.sort = action.payload
            state.page = 1
        })

        builder.addCase(getFiltersFromQueryParams, (state, action) => {
            console.log('Updating state from url search params...')
            state.filters = {
                ...state.filters,
                ...action.payload.filters,
            }

            console.log('New filters:', state.filters)

            state.sort = action.payload.sort
            state.page = action.payload.page
        })

        builder.addCase(goToPage, (state, action) => {
            state.page = action.payload
        })

        builder.addCase(clearSearchResults, (state) => {
            state.hits = []
            state.totalHits = 0
        })

        builder.addCase(updateSearchParams.fulfilled, (state, action) => {
            const { filters, page, sort } = action.payload
            console.log('Updating search params with:', action.payload)

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
                    page: page > 1 ? page : undefined,
                    sort: sort !== SortData.RELEVANCE ? sort : undefined,
                },
                keysToEmit
            )

            // update url search params
            state.searchParams = '?' + queryString.stringify(searchParams)
        })

        builder.addCase(openListing, (state, action) => {
            state.selectedListingId = action.payload
        })

        builder.addCase(closeListing, (state) => {
            state.selectedListingId = initialState.selectedListingId
        })
    },
})

export default searchSlice.reducer
