import { createSlice } from '@reduxjs/toolkit'
import { closeListing, openListing, searchListings, setFeatured } from './creators'
import type { ListingsState } from './types'

const initialState: ListingsState = {
    featured: [],
    search: {
        hits: null,
        totalHits: 0,
        isLoading: false,
        error: false,
    },
}

export const listingsSlice = createSlice({
    name: 'listings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(openListing, (state, action) => {
                state.opened = action.payload
            })
            .addCase(closeListing, (state) => {
                state.opened = undefined
            })
            .addCase(setFeatured, (state, action) => {
                state.featured = action.payload
            })
            .addCase(searchListings.pending, (state: ListingsState) => {
                state.search = {
                    ...initialState.search,
                    isLoading: true,
                }
            })
            .addCase(searchListings.fulfilled, (state, action) => {
                state.search = {
                    ...initialState.search,
                    ...action.payload,
                }
            })
            .addCase(searchListings.rejected, (state) => {
                state.search = {
                    ...initialState.search,
                    error: true,
                }
            })
    },
})

export const listingsReducer = listingsSlice.reducer
