import { SortData } from '@mewi/types'
import { createSlice, isFulfilled, isPending } from '@reduxjs/toolkit'
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
    isLoading: false,
    sort: SortData.RELEVANCE,
    page: 1,
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

        builder.addCase(clearFilters, (state) => {
            state.filters = initialState.filters
            state.sort = initialState.sort
            state.page = 1
        })

        builder.addCase(setFilters, (state, action) => {
            state.filters = action.payload
        })

        builder.addCase(updateFilters, (state, action) => {
            console.log('Updating filters')
            state.filters = {
                ...state.filters,
                ...action.payload,
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

        builder
            .addMatcher(isPending, (state) => {
                state.isLoading = true
            })
            .addMatcher(isFulfilled, (state) => {
                state.isLoading = false
            })
    },
})

export default searchSlice.reducer
