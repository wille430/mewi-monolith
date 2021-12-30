import { useState } from 'react'
import { SearchFilterDataProps } from '@mewi/types'
import AddWatcherButton from '../../../components/SearchFilterArea/AddWatcherButton'
import { Link, useHistory, useLocation } from 'react-router-dom'
import SearchFilterArea, { SearchFilterAreaProps } from 'components/SearchFilterArea'
import { useAppSelector } from 'hooks/hooks'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { getSearchResults, setFilters, updateFilters } from 'store/search/creators'
import _ from 'lodash'

type FilterAreaProps = Omit<SearchFilterAreaProps, 'searchFilterData' | 'setSearchFilterData'> & {
    defaultValues?: SearchFilterDataProps
}

const FilterArea = ({ defaultValues = {}, ...rest }: FilterAreaProps) => {
    const { isLoggedIn } = useAppSelector((state) => state.auth)
    const search = useAppSelector((state) => state.search)

    const history = useHistory()
    const dispatch = useDispatch()
    
    const handleSubmit = () => {
        // update url search params
        history.push({
            pathname: window.location.pathname,
            search: queryString.stringify(_.omit(search.filters, Object.keys(defaultValues || {}))),
        })
    }

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
            showSubmitButton={true}
            showResetButton={true}
            isCollapsable={true}
            onSubmit={handleSubmit}
            onReset={handleReset}
            actions={
                isLoggedIn ? (
                    <AddWatcherButton searchFilters={search.filters} data-testid='addWatcherButton' />
                ) : (
                    <Link to='/login'>Bevaka sökning</Link>
                )
            }
        />
    )
}

export default FilterArea
