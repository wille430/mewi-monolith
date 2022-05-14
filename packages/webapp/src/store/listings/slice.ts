import { createSlice } from '@reduxjs/toolkit'
import { closeListing, openListing } from './creators'
import { ListingsState } from './types'

const initialState: ListingsState = {}

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
    },
})

export const listingsReducer = listingsSlice.reducer
