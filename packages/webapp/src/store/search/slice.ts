import { SortData } from '@mewi/types'
import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import {
    clearFilters,
    getFiltersFromQueryParams,
    getSearchResults,
    goToPage,
    setFilters,
    setSort,
    updateFilters,
} from './creators'
import { SearchState } from './type'

const initialState: SearchState = {
    hits: [],
    totalHits: 0,
    filters: {},
    sort: SortData.RELEVANCE,
    page: 1,
    status: {
        searching: 'complete',
    },
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

        builder.addCase(clearFilters, (state) => {
            state.filters = initialState.filters
            state.sort = initialState.sort
            state.page = 1
        })

        builder.addCase(setFilters, (state, action) => {
            state.filters = action.payload
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
            state.filters = action.payload.filters
            state.sort = action.payload.sort
            state.page = action.payload.page
        })

        builder.addCase(goToPage, (state, action) => {
            state.page = action.payload
        })
    },
})

export default searchSlice.reducer
