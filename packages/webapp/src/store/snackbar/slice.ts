import { createSlice } from '@reduxjs/toolkit'
import { uniqueId } from 'lodash'
import { checkSuccessParam, clearSnackbarQueue, pushToSnackbar } from './creators'
import { nextSnackbar } from './creators'
import { SnackbarState } from './types'

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
                    state.current = action.payload
                }
            })
    },
})

export const snackbarReducer = snackbarSlice.reducer
