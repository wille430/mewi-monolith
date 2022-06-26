import { createSlice } from '@reduxjs/toolkit'
import { fetchUser, login, logout, setLoggedInStatus, signup } from './creators'
import { UserState } from './types'

const initialState: UserState = {
    isLoggedIn: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(setLoggedInStatus, (state, action) => {
                state.isLoggedIn = action.payload
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.isLoggedIn = true
            })
            .addCase(fetchUser.rejected, (state) => {
                state.user = undefined
                state.isLoggedIn = false
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
