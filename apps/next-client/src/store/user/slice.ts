import {createSlice} from "@reduxjs/toolkit";
import {login, logout, getUser, signup} from "./creators";
import type {UserState} from "./types";

const initialState: UserState = {
    isLoggedIn: false,
    user: null,
    isReady: false
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.isReady = false;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.user = action.payload.user;
                state.isReady = true;
            })
            .addCase(getUser.rejected, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.isReady = true;
            })
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(login.rejected, () => {
                return initialState;
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(signup.rejected, (state) => {
                state.isLoggedIn = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
            });
    },
});

export const userReducer = userSlice.reducer;
