import { SearchFilterDataProps, SortData } from '@mewi/types'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import searchApi from 'api/searchApi'
import { RootState } from 'store'
import { SearchActionTypes, SearchState } from './type'
import queryString from 'query-string'
import _ from 'lodash'

export const clearFilters = createAction(
    SearchActionTypes.CLEAR_FILTERS,
    (filtersToKeep?: Partial<SearchFilterDataProps>) => {
        return {
            payload: filtersToKeep,
        }
    }
)

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
        const { filters, sort, page } = thunkApi.getState().search
        console.log('Searching for', filters.keyword)
        const results = await searchApi.getSearchResults({
            searchFilters: filters,
            sort: sort,
            page: page,
        })
        return results
    } catch (e) {
        return thunkApi.rejectWithValue(e)
    }
})

export const setSort = createAction(SearchActionTypes.SORT, (sortData: SortData) => {
    return { payload: sortData }
})

export const getFiltersFromQueryParams = createAction(
    SearchActionTypes.FILTERS_FROM_PARAMS,
    (
        defaultValues?: Partial<SearchFilterDataProps>
    ): { payload: Pick<SearchState, 'filters' | 'sort' | 'page'> } => {
        const params = queryString.parse(window.location.search)

        let filters: SearchFilterDataProps = {}
        let sort = SortData.RELEVANCE
        let page = 1
        Object.keys(params).forEach((key) => {
            if (['keyword', 'regions', 'auction', 'priceRangeGte', 'priceRangeLte'].includes(key)) {
                switch (key as keyof SearchFilterDataProps) {
                    case 'auction':
                        if (params[key] === 'true') {
                            filters = _.merge(filters, { [key]: true })
                        } else {
                            filters = _.omit(filters, key)
                        }
                        break
                    default:
                        filters = _.merge(filters, { [key]: params[key] })
                }
            } else if (key === 'sort') {
                if (Object.values(SortData).includes(params[key] as SortData)) {
                    sort = params[key] as SortData
                }
            } else if (key === 'page') {
                page = parseInt(params[key] as string)
                if (page <= 0) {
                    page = 1
                }
            }
        })

        if (defaultValues) {
            return {
                payload: {
                    filters: {
                        ...filters,
                        ...defaultValues,
                    },
                    sort,
                    page,
                },
            }
        } else {
            return {
                payload: {
                    filters,
                    sort,
                    page,
                },
            }
        }
    }
)

export const goToPage = createAction(SearchActionTypes.SET_PAGE, (page: number) => {
    return {
        payload: page,
    }
})

export const clearSearchResults = createAction(SearchActionTypes.CLEAR_RESULTS)
