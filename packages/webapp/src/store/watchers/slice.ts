import { DatabaseErrorCodes, WatcherErrorCodes } from '@mewi/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { searchSlice } from 'store/search/slice'
import { createWatcher, getAllWatchers, removeWatcher } from './creators'
import { WatchersState } from './types'

const initialState: WatchersState = {
    watchers: [],
    isLoading: false,
    error: '',
}

export const watchersSlice = createSlice({
    name: 'watchers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createWatcher.fulfilled, (state, action) => {
                state.watchers.push(action.payload)
            })
            .addCase(createWatcher.rejected, (state, action: PayloadAction<any>) => {
                switch (action.payload.error?.type) {
                    case WatcherErrorCodes.INVALID_QUERY:
                        state.error = 'Felaktigt filter'
                        break
                    case DatabaseErrorCodes.CONFLICTING_RESOURCE:
                        state.error = 'En bevakning med samma sökning finns redan'
                        break
                    default:
                        state.error = 'Ett fel inträffade'
                }
            })

        builder
            .addCase(getAllWatchers.fulfilled, (state, action) => {
                state.watchers = action.payload
            })
            .addCase(getAllWatchers.rejected, (state, action: PayloadAction<any>) => {
                state.error = 'Ett fel inträffade'
            })

        builder
            .addCase(removeWatcher.fulfilled, (state, action) => {
                state.watchers = state.watchers.filter(
                    (watcher) => watcher._id.toString() !== action.payload
                )
            })
            .addCase(removeWatcher.rejected, (state, action: PayloadAction<any>) => {
                state.error = 'Ett fel inträffade'
            })
    },
})

export default watchersSlice.reducer
