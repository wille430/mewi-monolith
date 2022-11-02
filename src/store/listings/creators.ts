import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { IListing, IUser } from '@/common/schemas'
import queryString from 'query-string'
import { ListingsActionTypes } from './types'
import { client } from '@/lib/client'
import { ListingSearchFilters } from '@/common/types'

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

type LikeListingArgs = UnlikeListingArgs

export const likeListing = createAsyncThunk(
    ListingsActionTypes.LIKE,
    async (args: LikeListingArgs, thunkAPI) => {
        const { listing } = args
        try {
            await client.put(`/listings/${listing.id}/like`).catch((e) => {
                throw e
            })
            return args
        } catch (e) {
            return thunkAPI.rejectWithValue(args)
        }
    }
)

type UnlikeListingArgs = {
    listing: IListing
    user: IUser
}

export const unlikeListing = createAsyncThunk(
    ListingsActionTypes.UNLIKE,
    async (args: UnlikeListingArgs, thunkAPI) => {
        const { listing } = args
        try {
            await client.put(`/listings/${listing.id}/unlike`).catch((e) => {
                throw e
            })
            return args
        } catch (e) {
            return thunkAPI.rejectWithValue(args)
        }
    }
)

export const searchListings = createAsyncThunk(
    ListingsActionTypes.FETCH_SEARCH,
    async (filters: ListingSearchFilters, thunkAPI) => {
        try {
            return await client
                .get<{ hits: IListing[]; totalHits: number }>(
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
