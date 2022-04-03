import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import ItemPopUp from '../ItemPopUp/ItemPopUp'
import styles from './ListingGrid.module.scss'
import classNames from 'classnames'
import { IListing } from '@mewi/common/types'
import { useInfiniteQuery } from 'react-query'
import useQuery from 'hooks/useQuery'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getSearchResults } from 'store/search/creators'
import { useEffect } from 'react'
import _ from 'lodash'

const cx = classNames.bind(styles)

const ListingGrid = () => {
    const currentPage = +(useQuery().get('page') || 1)
    const filters = useAppSelector((state) => state.search.filters)
    const dispatch = useAppDispatch()

    const fetchListings = async (): Promise<IListing[]> => {
        return (await dispatch(getSearchResults()).unwrap()).hits
    }

    const {
        data: listings,
        isLoading,
        error,
        isFetching,
        fetchNextPage,
    } = useInfiniteQuery<IListing[]>(['listings', _.omit(filters, 'page')], fetchListings, {
        getNextPageParam: () => currentPage + 1,
        getPreviousPageParam: () => currentPage - 1,
        refetchOnWindowFocus: false,
    })

    const renderItems = () => {
        return listings?.pages[currentPage - 1].map((item, i: number) => (
            <ArticleItem key={i} props={item} id={item.id} />
        ))
    }

    useEffect(() => {
        if (filters.page > listings?.pages?.length && filters.page > 0) {
            console.log('fetching next...')
            fetchNextPage()
        }
    }, [filters.page])

    if (isLoading || isFetching) {
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
