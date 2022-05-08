import { createSlice } from '@reduxjs/toolkit'
import { setLoggedInStatus } from './creators'
import { UserState } from './types'

const initialState: UserState = {
    isLoggedIn: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setLoggedInStatus, (state, action) => {
            state.isLoggedIn = action.payload
        })
    },
})

export const userReducer = userSlice.reducer
