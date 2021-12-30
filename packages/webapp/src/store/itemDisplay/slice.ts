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
            console.log(action.payload)
            state.selectedItem = action.payload
            state.isLoading = false
        })

        builder.addCase(clearItem, (state, action) => {
            state.selectedItem = null
        })

        builder
            .addMatcher(isFulfilled, (state, action) => {
                state.isLoading = false
            })
            .addMatcher(isPending, (state, action) => {
                state.isLoading = true
            })
    },
})

export default itemDisplaySlice.reducer
