import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import queryString from 'query-string'
import { ListingsActionTypes } from './types'
import { ListingSearchFilters } from '@/common/types'
import { client } from '@/lib/client'
import {ListingDto} from "@mewi/models"

export const openListing = createAction(ListingsActionTypes.OPEN_LISTING, (listing: ListingDto) => {
    return {
        payload: listing,
    }
})

export const closeListing = createAction(ListingsActionTypes.CLOSE_LISTING)

export const searchListings = createAsyncThunk(
    ListingsActionTypes.FETCH_SEARCH,
    async (filters: ListingSearchFilters, thunkAPI) => {
        try {
            return await client.get<{ hits: ListingDto[]; totalHits: number }>(
                '/listings?' + queryString.stringify(filters)
            )
        } catch (e) {
            return thunkAPI.rejectWithValue(null)
        }
    }
)
