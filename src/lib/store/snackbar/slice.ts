import { createSlice } from '@reduxjs/toolkit'
import uniqueId from 'lodash/uniqueId'
import { checkSuccessParam, clearSnackbarQueue, nextSnackbar, pushToSnackbar } from './creators'
import type { SnackbarState } from './types'

const initialState: SnackbarState = {
    queue: [],
}

export const snackbarSlice = createSlice({
    name: 'snackabr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(pushToSnackbar, (state, action) => {
                if (state.current) {
                    state.queue = [...state.queue, action.payload]
                } else {
                    state.current = { id: uniqueId(), ...action.payload }
                }
            })
            .addCase(nextSnackbar, (state) => {
                const newSnack = state.queue.shift()

                if (newSnack) {
                    state.current = { id: uniqueId(), ...newSnack }
                } else {
                    state.current = undefined
                }
            })
            .addCase(clearSnackbarQueue, (state) => {
                state.queue = []
                state.current = undefined
            })
            .addCase(checkSuccessParam, (state, action) => {
                if (action.payload) {
                    state.current = action.payload as any
                }
            })
    },
})

export const snackbarReducer = snackbarSlice.reducer
