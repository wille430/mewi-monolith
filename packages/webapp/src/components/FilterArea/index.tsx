import { SearchFilterDataProps, SortData } from '@mewi/types'
import AddWatcherButton from '../SearchFilterArea/AddWatcherButton'
import { Link, useHistory } from 'react-router-dom'
import SearchFilterArea, { SearchFilterAreaProps } from 'components/SearchFilterArea'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import queryString from 'query-string'
import {
    clearFilters,
    getFiltersFromQueryParams,
    getSearchResults,
    setFilters,
} from 'store/search/creators'
import _ from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import PopUp from 'components/PopUp/ index'
import styles from './index.module.scss'
import classNames from 'classnames'
import { Button } from '@mewi/ui'
import { useWindowWidth } from '@react-hook/window-size'
import { screens } from 'themes/tailwindConfig'

const cx = classNames.bind(styles)

type FilterAreaProps = Omit<SearchFilterAreaProps, 'searchFilterData' | 'setSearchFilterData'> & {
    defaultValues?: SearchFilterDataProps
}

const FilterArea = ({ defaultValues = {}, ...rest }: FilterAreaProps) => {
    const { isLoggedIn } = useAppSelector((state) => state.auth)
    const search = useAppSelector((state) => state.search)
    const windowWidth = useWindowWidth()

    const [_filters, _setFilters] = useState(search.filters)

    const [showPopUp, setShowPopUp] = useState(false)

    const history = useHistory()
    const dispatch = useAppDispatch()

    const firstRender = useRef(true)

    // const getSearchResultsDebounce = useCallback(
    //     _.debounce((_search) => {
    //         console.log('Updating url search params and getting new search results...')
    //         updateSearchParams(_search)
    //         dispatch(getSearchResults()).then(() => console.log('Updated search results!'))
    //     }, 750),
    //     []
    // )

    const debounceSetFilters = useCallback(
        _.debounce((filters: typeof search.filters) => {
            dispatch(setFilters(filters))
        }, 500),
        []
    )

    const updateSearchParams = (_search: typeof search) => {
        console.log({ filters: _search.filters })

        if (_search.filters.keyword) {
            document.title = `Sökning för "${_search.filters.keyword}" - Mewi`
        } else {
            document.title = 'Sök - Mewi.se'
        }

        // update url search params
        history.push({
            pathname: window.location.pathname,
            search: queryString.stringify(
                _.omit(
                    {
                        ..._search.filters,
                        page: _search.page,
                        sort: _search.sort !== SortData.RELEVANCE ? _search.sort : undefined,
                    },
                    Object.keys(defaultValues || {})
                )
            ),
        })
    }

    useEffect(() => {
        dispatch(getFiltersFromQueryParams())

        // clear filters on unmount
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    // sync global and component filter state
    useEffect(() => {
        if (search.filters !== _filters) {
            _setFilters(search.filters)
        }
    }, [search.filters])

    useEffect(() => {
        if (search.filters !== _filters) {
            debounceSetFilters(_filters)
        }
    }, [_filters])

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }

        updateSearchParams(search)
        dispatch(getSearchResults())
    }, [search.filters, search.page, search.sort])

    const handleReset = () => {
        dispatch(setFilters(defaultValues))
    }

    const SearchFilterAreaArgs: SearchFilterAreaProps = {
        ...rest,
        searchFilterData: _filters,
        heading: 'Filtrera sökning',
        showSubmitButton: false,
        showResetButton: true,
        onReset: handleReset,
        onChange: (key, value) => {
            _setFilters((prevState) => ({
                ...prevState,
                [key]: value,
            }))
        },
        onValueDelete: (key) => {
            _setFilters((prevState) => _.omit(prevState, key))
        },
        actions: isLoggedIn ? (
            <AddWatcherButton searchFilters={search.filters} data-testid='addWatcherButton' />
        ) : (
            <Link to='/login'>Bevaka sökning</Link>
        ),
    }

    if (windowWidth >= parseInt(screens['lg'])) {
        return <SearchFilterArea {...SearchFilterAreaArgs} />
    } else {
        return (
            <>
                <PopUp show={showPopUp} onOutsideClick={() => setShowPopUp(false)}>
                    <SearchFilterArea {...SearchFilterAreaArgs} />
                </PopUp>
                <Button
                    className={cx({
                        [styles.showFiltersButton]: true,
                    })}
                    onClick={() => setShowPopUp(true)}
                    label='Show filters'
                    data-testid='showFilters'
                ></Button>
            </>
        )
    }
}
export default FilterArea
