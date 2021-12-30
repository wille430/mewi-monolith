import { SearchFilterDataProps, SortData } from '@mewi/types'
import AddWatcherButton from '../SearchFilterArea/AddWatcherButton'
import { Link, useHistory } from 'react-router-dom'
import SearchFilterArea, { SearchFilterAreaProps } from 'components/SearchFilterArea'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { setFilters, updateFilters } from 'store/search/creators'
import _ from 'lodash'
import { useEffect, useRef } from 'react'

type FilterAreaProps = Omit<SearchFilterAreaProps, 'searchFilterData' | 'setSearchFilterData'> & {
    defaultValues?: SearchFilterDataProps
}

const FilterArea = ({ defaultValues = {}, ...rest }: FilterAreaProps) => {
    const { isLoggedIn } = useAppSelector((state) => state.auth)
    const search = useAppSelector((state) => state.search)

    const history = useHistory()
    const dispatch = useDispatch()

    const firstUpdate = useRef(true)

    useEffect(() => {
        // don't run on first update
        if (firstUpdate.current) {
            firstUpdate.current = false
            return
        }

        // update url search params
        history.push({
            pathname: window.location.pathname,
            search: queryString.stringify(
                _.omit({ ...search.filters, page: search.page, sort: search.sort !== SortData.RELEVANCE ? search.sort : undefined }, Object.keys(defaultValues || {}))
            ),
        })
    }, [search.filters, search.page, search.sort])

    const handleReset = () => {
        dispatch(setFilters(defaultValues))
    }

    return (
        <SearchFilterArea
            {...rest}
            searchFilterData={search.filters}
            setSearchFilterData={(newVal) => {
                dispatch(updateFilters(newVal))
            }}
            heading='Filtrera sökning'
            showSubmitButton={false}
            showResetButton={true}
            isCollapsable={true}
            onReset={handleReset}
            actions={
                isLoggedIn ? (
                    <AddWatcherButton
                        searchFilters={search.filters}
                        data-testid='addWatcherButton'
                    />
                ) : (
                    <Link to='/login'>Bevaka sökning</Link>
                )
            }
        />
    )
}

export default FilterArea
