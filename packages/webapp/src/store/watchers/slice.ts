import { createSlice } from '@reduxjs/toolkit'
import { createWatcher, getAllWatchers, getNewItems, removeWatcher } from './creators'
import { WatchersState } from './types'

const initialState: WatchersState = {
    watchers: [],
    isLoading: false,
    newItems: {},
}

export const watchersSlice = createSlice({
    name: 'watchers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createWatcher.fulfilled, (state, action) => {
            state.watchers.push(action.payload)
        })
        // .addCase(createWatcher.rejected, (state, action: PayloadAction<any>) => {
        //     switch (action.payload.error?.type) {
        //         case WatcherErrorCodes.INVALID_QUERY:
        //             state.error = 'Felaktigt filter'
        //             break
        //         case DatabaseErrorCodes.CONFLICTING_RESOURCE:
        //             state.error = 'En bevakning med samma sökning finns redan'
        //             break
        //         default:
        //             state.error = 'Ett fel inträffade'
        //     }
        // })

        builder.addCase(getAllWatchers.fulfilled, (state, action) => {
            state.watchers = action.payload
        })

        builder.addCase(removeWatcher.fulfilled, (state, action) => {
            state.watchers = state.watchers.filter(
                (watcher) => watcher._id.toString() !== action.payload
            )
        })

        builder.addCase(getNewItems.fulfilled, (state, action) => {
            if (!action.payload) return

            state.newItems[action.payload.id] = action.payload.newItems
        })
    },
})

export default watchersSlice.reducer
