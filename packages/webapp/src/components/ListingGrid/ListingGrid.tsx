import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import ItemPopUp from '../ItemPopUp/ItemPopUp'
import styles from './ListingGrid.module.scss'
import classNames from 'classnames'
import { IListing, ListingSearchFilters } from '@mewi/common/types'
import { useInfiniteQuery } from 'react-query'
import useQuery from 'hooks/useQuery'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getSearchResults } from 'store/search/creators'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'

const cx = classNames.bind(styles)

const NON_DEBOUNCED_FILTERS: (keyof ListingSearchFilters)[] = ['category']

const ListingGrid = () => {
    const currentPage = +(useQuery().get('page') || 1)
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
        return (await dispatch(getSearchResults()).unwrap()).hits
    }

    const {
        data: listings,
        isLoading,
        error,
        isFetching,
        fetchNextPage,
    } = useInfiniteQuery<IListing[]>(
        [
            'listings',
            { ..._.omit(debouncedFilters, 'page'), ..._.pick(filters, NON_DEBOUNCED_FILTERS) },
        ],
        fetchListings,
        {
            getNextPageParam: () => currentPage + 1,
            getPreviousPageParam: () => currentPage - 1,
            refetchOnWindowFocus: false,
            retry: false,
        }
    )

    const renderItems = () => {
        return listings?.pages[currentPage - 1].map((item, i: number) => (
            <ArticleItem key={i} props={item} id={item.id} />
        ))
    }

    useEffect(() => {
        if (filters.page > listings?.pages?.length && filters.page > 0) {
            fetchNextPage()
        }
    }, [filters.page])

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
        if (listings.pages[currentPage - 1] && listings?.pages[currentPage - 1].length) {
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
