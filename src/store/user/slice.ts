import { createSlice } from '@reduxjs/toolkit'
import { login, logout, setLoggedInStatus, signup } from './creators'
import type { UserState } from './types'

const initialState: UserState = {
    isLoggedIn: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(setLoggedInStatus, (state, action) => {
                state.isLoggedIn = action.payload.status
                state.user = action.payload.user
            })
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(login.rejected, () => {
                return initialState
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(signup.rejected, (state) => {
                state.isLoggedIn = false
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false
                state.user = undefined
            })
    },
})

export const userReducer = userSlice.reducer
