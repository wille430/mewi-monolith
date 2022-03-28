import { SearchFilterDataProps } from '@mewi/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import searchApi from 'api/searchApi'
import watcherApi from 'api/watcherApi'
import { RootState } from 'store'
import { WatchersActionType } from './types'

export const createWatcher = createAsyncThunk(
    WatchersActionType.WATCHERS_ADD,
    async (searchFilters: SearchFilterDataProps, thunkApi) => {
        try {
            return await watcherApi.createWatcher(searchFilters)
        } catch (e: any) {
            return thunkApi.rejectWithValue(e)
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

// TODO: update

export const getNewItems = createAsyncThunk(
    WatchersActionType.GET_NEW_ITEMS,
    async (id: string, thunkApi) => {
        const state = thunkApi.getState() as RootState
        const watcher = state.watchers.watchers.find((x) => x._id.toString() === id)
        if (!watcher) {
            console.log(`Watcher with id ${id} not found`)
            return undefined
        }

        const { hits: newItems } = await searchApi.getSearchResults({
            searchFilters: {
                ...watcher.metadata,
                dateGte: new Date(watcher.createdAt).getTime(),
            },
            limit: 5,
        })

        return {
            id,
            newItems,
        }
    }
)
