import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { IListing } from '@/common/schemas'
import queryString from 'query-string'
import { ListingsActionTypes } from './types'
import { ListingSearchFilters } from '@/common/types'
import { client } from '@/lib/client'

export const openListing = createAction(ListingsActionTypes.OPEN_LISTING, (listing: IListing) => {
    return {
        payload: listing,
    }
})

export const closeListing = createAction(ListingsActionTypes.CLOSE_LISTING)

export const setFeatured = createAction(
    ListingsActionTypes.SET_FEATURED,
    (listings: IListing[] = []) => {
        return {
            payload: listings,
        }
    }
)

export const searchListings = createAsyncThunk(
    ListingsActionTypes.FETCH_SEARCH,
    async (filters: ListingSearchFilters, thunkAPI) => {
        try {
            return await client.get<{ hits: IListing[]; totalHits: number }>(
                '/listings?' + queryString.stringify(filters)
            )
        } catch (e) {
            return thunkAPI.rejectWithValue(null)
        }
    }
)
