import { createSlice, isFulfilled, isPending } from '@reduxjs/toolkit'
import { clearItem, getItem } from './creators'
import { ItemDisplayState } from './types'

const initialState: ItemDisplayState = {
    selectedItem: null,
    isLoading: false,
    error: '',
}

export const itemDisplaySlice = createSlice({
    name: 'itemDisplay',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getItem.fulfilled, (state, action) => {
            state.selectedItem = action.payload
            state.isLoading = false
        })

        builder.addCase(clearItem, (state) => {
            console.log('clearing item')
            state.selectedItem = null
        })

        builder
            .addMatcher(isFulfilled, (state) => {
                state.isLoading = false
            })
            .addMatcher(isPending, (state) => {
                state.isLoading = true
            })
    },
})

export default itemDisplaySlice.reducer
