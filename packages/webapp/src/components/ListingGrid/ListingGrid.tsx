import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import ItemPopUp from '../ItemPopUp/ItemPopUp'
import styles from './ListingGrid.module.scss'
import classNames from 'classnames'
import { IListing, ListingSearchFilters } from '@wille430/common'
import { useQuery } from 'react-query'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getSearchResults } from 'store/search/creators'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'

const cx = classNames.bind(styles)

const NON_DEBOUNCED_FILTERS: (keyof ListingSearchFilters)[] = ['category', 'page']

const ListingGrid = () => {
    const filters = useAppSelector((state) => state.search.filters)
    const dispatch = useAppDispatch()
    const [shouldFetch, setShouldFetch] = useState(false)
    const [debouncedFilters, _setDebouncedFilters] = useState(filters)
    const setDebouncedFilters = useCallback(
        _.debounce((newFilters: typeof filters) => {
            setShouldFetch(false)
            _setDebouncedFilters(newFilters)
        }, 500),
        []
    )

    useEffect(() => {
        setShouldFetch(true)
        setDebouncedFilters(filters)
    }, [filters])

    const fetchListings = async (): Promise<IListing[]> => {
        const listings = await dispatch(getSearchResults()).unwrap()
        return listings.hits
    }

    const {
        data: listings,
        isLoading,
        error,
        isFetching,
    } = useQuery<IListing[]>(
        ['listings', { ...debouncedFilters, ..._.pick(filters, NON_DEBOUNCED_FILTERS) }],
        fetchListings,
        {
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        }
    )

    const renderItems = () => {
        return listings?.map((item, i: number) => <ArticleItem key={i} props={item} id={item.id} />)
    }

    if (isLoading || isFetching || shouldFetch) {
        return (
            <section
                className={cx({
                    [styles.center]: true,
                })}
            >
                <StyledLoader />
            </section>
        )
    } else if (error) {
        return (
            <section className={styles.center}>
                <span>Ett fel inträffade</span>
            </section>
        )
    } else {
        if (listings?.length) {
            return (
                <section className={styles.grid}>
                    {renderItems()}
                    <ItemPopUp />
                </section>
            )
        } else {
            return (
                <section className={cx({ [styles.center]: true })}>
                    <span>Inga resultat hittades för din sökning.</span>
                </section>
            )
        }
    }
}

export default ListingGrid
