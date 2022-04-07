import { ListingSearchFilters } from '@wille430/common/types'
import AddWatcherButton from '../SearchFilterArea/AddWatcherButton'
import { Link } from 'react-router-dom'
import SearchFilterArea, {
    SearchFilterAreaProps,
} from 'components/SearchFilterArea/SearchFilterArea'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { clearFilters, getFiltersFromQueryParams, updateFilters } from 'store/search/creators'
import { useEffect, useState } from 'react'
import PopUp from 'components/PopUp/PopUp'
import styles from './FilterArea.module.scss'
import classNames from 'classnames'
import { Button } from '@mewi/ui'
import { useWindowWidth } from '@react-hook/window-size'
import { screens } from 'themes/tailwindConfig'

const cx = classNames.bind(styles)

type FilterAreaProps = Omit<SearchFilterAreaProps, 'searchFilterData' | 'setSearchFilterData'> & {
    defaultValues?: ListingSearchFilters
}

const FilterArea = ({ defaultValues = {}, ...rest }: FilterAreaProps) => {
    const { isLoggedIn } = useAppSelector((state) => state.auth)
    const search = useAppSelector((state) => state.search)
    const windowWidth = useWindowWidth()

    const [showPopUp, setShowPopUp] = useState(false)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getFiltersFromQueryParams())

        // clear filters on unmount
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    const handleReset = () => {
        dispatch(clearFilters(defaultValues))
    }

    const SearchFilterAreaArgs: SearchFilterAreaProps = {
        ...rest,
        searchFilterData: search.filters,
        heading: 'Filtrera sökning',
        showSubmitButton: false,
        showResetButton: true,
        onReset: handleReset,
        onChange: (key, value) => dispatch(updateFilters({ [key]: value })),
        onValueDelete: (key) => dispatch(updateFilters({ [key]: undefined })),
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
