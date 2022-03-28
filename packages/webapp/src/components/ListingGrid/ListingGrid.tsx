import StyledLoader from 'components/StyledLoader'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import ItemPopUp from '../ItemPopUp/ItemPopUp'
import styles from './ListingGrid.module.scss'
import classNames from 'classnames'
import { ItemData } from '@mewi/types'
import { useInfiniteQuery } from 'react-query'
import useQuery from 'hooks/useQuery'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { getSearchResults } from 'store/search/creators'

const cx = classNames.bind(styles)

const ListingGrid = () => {
    const currentPage = +(useQuery().get('page') || 0)
    const filters = useAppSelector((state) => state.search.filters)
    const dispatch = useAppDispatch()

    const fetchListings = async (): Promise<ItemData[]> => {
        return (await dispatch(getSearchResults()).unwrap()).hits
    }

    const {
        data: listings,
        isLoading,
        error,
        isFetching,
    } = useInfiniteQuery<ItemData[]>(['listings', { ...filters }], fetchListings, {
        getNextPageParam: (lastPage, allPages) => currentPage + 1,
        refetchOnWindowFocus: false,
    })

    const renderItems = () => {
        return listings?.pages[currentPage].map((item, i: number) => (
            <ArticleItem key={i} props={item} id={item.id} />
        ))
    }

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
            <section className={cx({ [styles.center]: true })}>
                <span>Ett fel inträffade</span>
            </section>
        )
    } else {
        if (listings?.pages[currentPage].length || 0 > 0) {
            return (
                <section
                    className={cx({
                        [styles.grid]: true,
                    })}
                >
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
