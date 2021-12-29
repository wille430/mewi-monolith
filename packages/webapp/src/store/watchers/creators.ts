import { SearchFilterDataProps } from '@mewi/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import watcherApi from 'api/watcherApi'
import { WatchersActionType } from './types'

export const createWatcher = createAsyncThunk(
    WatchersActionType.WATCHERS_ADD,
    async (searchFilters: SearchFilterDataProps, thunkAPI) => {
        try {
            return await watcherApi.createWatcher(searchFilters)
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getAllWatchers = createAsyncThunk(WatchersActionType.WATCHERS_FETCH, async () => {
    return await watcherApi.getWatchers()
})

export const removeWatcher = createAsyncThunk(
    WatchersActionType.WATCHERS_DELETE,
    async (watcherId: string, thunkAPI) => {
        try {
            await watcherApi.deleteWatcher(watcherId)
            return watcherId
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e)
        }
    }
)

// to-do: update
