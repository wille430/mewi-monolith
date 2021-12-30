import { SortData } from '@mewi/types'
import { createSlice, isFulfilled, isPending } from '@reduxjs/toolkit'
import { clearFilters, getFiltersFromQueryParams, getSearchResults, setFilters, setSort, updateFilters } from './creators'
import { SearchState } from './type'

const initialState: SearchState = {
    hits: [],
    totalHits: 0,
    filters: {},
    isLoading: false,
    sort: SortData.RELEVANCE,
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
        })

        builder.addCase(setFilters, (state, action) => {
            state.filters = action.payload
        })

        builder.addCase(updateFilters, (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            }
        })

        builder.addCase(setSort, (state, action) => {
            state.sort = action.payload
        })

        builder.addCase(getFiltersFromQueryParams, (state, action) => {
            console.log('Updating state from url search params...')
            state.filters = action.payload.filters
            state.sort = action.payload.sort
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
