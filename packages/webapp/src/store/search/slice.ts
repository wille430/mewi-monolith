import { SortData } from '@mewi/types'
import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import {
    clearFilters,
    clearSearchResults,
    getFiltersFromQueryParams,
    getSearchResults,
    goToPage,
    setFilters,
    setSort,
    updateFilters,
    updateSearchParams,
} from './creators'
import { SearchState } from './type'
import queryString from 'query-string'

const initialState: SearchState = {
    hits: [],
    totalHits: 0,
    filters: {},
    sort: SortData.RELEVANCE,
    page: 1,
    status: {
        searching: 'complete',
    },
    searchParams: '',
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSearchResults.pending, (state) => {
                state.status.searching = 'loading'
            })
            .addCase(getSearchResults.fulfilled, (state, action) => {
                state.hits = action.payload.hits
                state.totalHits = action.payload.totalHits
                state.status.searching = 'complete'
            })
            .addCase(getSearchResults.rejected, (state) => {
                state.status.searching = 'error'
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
            state.status.searching = 'loading'
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

            state.status.searching = 'loading'
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
            state.status.searching = 'loading'
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
            state.searchParams = queryString.stringify(searchParams)
        })
    },
})

export default searchSlice.reducer
