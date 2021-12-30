import { SearchFilterDataProps, SortData } from '@mewi/types'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import searchApi from 'api/searchApi'
import { RootState } from 'store'
import { SearchActionTypes, SearchState } from './type'

export const clearFilters = createAction(SearchActionTypes.CLEAR_FILTERS)

export const setFilters = createAction(
    SearchActionTypes.SET_FILTERS,
    (filters: SearchFilterDataProps) => {
        return { payload: filters }
    }
)

export const updateFilters = createAction(
    SearchActionTypes.UPDATE_FILTERS,
    (filters: Partial<SearchFilterDataProps>) => {
        return {
            payload: filters,
        }
    }
)

export const getSearchResults = createAsyncThunk<
    Pick<SearchState, 'hits' | 'totalHits'>,
    void,
    { state: RootState }
>(SearchActionTypes.GET_RESULTS, async (args, thunkApi) => {
    try {
        const { filters, sort } = thunkApi.getState().search
        const results = await searchApi.getSearchResults({
            searchFilters: filters,
            sort: sort
        })
        return results
    } catch (e) {
        return thunkApi.rejectWithValue(e)
    }
})

export const setSort = createAction(SearchActionTypes.SORT, (sortData: SortData) => {
    return { payload: sortData }
})
