import { createSlice } from '@reduxjs/toolkit'
import {
    closeListing,
    likeListing,
    openListing,
    searchListings,
    setFeatured,
    unlikeListing,
} from './creators'
import type { ListingsState } from './types'
import { like, unlike } from '@/lib/listings'

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
            .addCase(likeListing.pending, (state: ListingsState, action) => {
                const { listing, user } = action.meta.arg

                if (!listing || !user) return

                state.featured = like(listing, user, state.featured)
                if (state.search.hits) state.search.hits = like(listing, user, state.search.hits)
            })
            .addCase(likeListing.rejected, (state, action) => {
                const { listing, user } = action.meta.arg

                state.featured = unlike(listing, user, state.featured)
                if (state.search.hits) state.search.hits = unlike(listing, user, state.search.hits)
            })
            .addCase(unlikeListing.pending, (state: ListingsState, action) => {
                const { listing, user } = action.meta.arg

                if (!listing || !user) return

                state.featured = unlike(listing, user, state.featured)
                if (state.search.hits) state.search.hits = unlike(listing, user, state.search.hits)
            })
            .addCase(unlikeListing.rejected, (state, action) => {
                const { listing, user } = action.meta.arg

                state.featured = like(listing, user, state.featured)
                if (state.search.hits) state.search.hits = like(listing, user, state.search.hits)
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
