import { createSlice, isFulfilled, isPending } from '@reduxjs/toolkit'
import { clearFilters, getSearchResults, setFilters, updateFilters } from './creators'
import { SearchState } from './type'

const initialState: SearchState = {
    hits: [],
    totalHits: 0,
    filters: {},
    isLoading: false,
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
            state.filters = {}
        })

        builder.addCase(setFilters, (state, action) => {
            console.log({ payload: action.payload })
            state.filters = action.payload
            console.log({ state: state.filters })
        })

        builder.addCase(updateFilters, (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            }
        })

        builder
            .addMatcher(isPending, (state, action) => {
                state.isLoading = true
            })
            .addMatcher(isFulfilled, (state, action) => {
                state.isLoading = false
            })
    },
})

export default searchSlice.reducer
