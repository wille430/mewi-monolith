import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Listing } from '@mewi/prisma/index-browser'
import { ListingSearchFilters } from '@wille430/common'
import queryString from 'query-string'
import { ListingsActionTypes } from './types'
import { instance } from '@/lib/axios'

// TODO: allow Listing or ID as args, if ID fetch listing
export const openListing = createAction(ListingsActionTypes.OPEN_LISTING, (listing: Listing) => {
    return {
        payload: listing,
    }
})

export const closeListing = createAction(ListingsActionTypes.CLOSE_LISTING)

export const setFeatured = createAction(
    ListingsActionTypes.SET_FEATURED,
    (listings: Listing[] = []) => {
        return {
            payload: listings,
        }
    }
)

export const likeListing = createAsyncThunk(
    ListingsActionTypes.LIKE,
    async ({ listingId, userId }: { listingId: string; userId: string }, thunkAPI) => {
        try {
            await instance.put(`/listings/${listingId}/like`).catch((e) => {
                throw e
            })
            return { listingId, userId }
        } catch (e) {
            return thunkAPI.rejectWithValue({ listingId, userId })
        }
    }
)

export const unlikeListing = createAsyncThunk(
    ListingsActionTypes.UNLIKE,
    async ({ listingId, userId }: { listingId: string; userId: string }, thunkAPI) => {
        try {
            await instance.put(`/listings/${listingId}/unlike`).catch((e) => {
                throw e
            })
            return { listingId, userId }
        } catch (e) {
            return thunkAPI.rejectWithValue({ listingId, userId })
        }
    }
)

export const searchListings = createAsyncThunk(
    ListingsActionTypes.FETCH_SEARCH,
    async (filters: ListingSearchFilters, thunkAPI) => {
        try {
            return await instance
                .get<{ hits: Listing[]; totalHits: number }>(
                    '/listings?' + queryString.stringify(filters)
                )
                .then((res) => res.data)
                .catch((e) => {
                    throw e
                })
        } catch (e) {
            return thunkAPI.rejectWithValue(null)
        }
    }
)
