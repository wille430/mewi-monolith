import classNames from 'classnames'
import { useQueryClient } from 'react-query'
import { Listing } from '@mewi/prisma/index-browser'
import styles from './ListingGrid.module.scss'
import { ListingWidget } from '../ListingWidget/ListingWidget'
import StyledLoader from '../StyledLoader'
import { useListingFilters } from '@/hooks/useListingFilters'
import { useAppDispatch } from '@/hooks'
import { openListing } from '@/store/listings'

const cx = classNames.bind(styles)

const ListingGrid = () => {
    const { debouncedFilters } = useListingFilters()
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()

    const { data, isFetching, error } = queryClient.getQueryState<any>([
        'listings',
        debouncedFilters,
    ])
    const listings = data?.hits as Listing[]

    if (isFetching) {
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
    } else if (listings?.length) {
        return (
            <section className={styles.grid}>
                {listings.map((listing) => (
                    <ListingWidget
                        onClick={() => dispatch(openListing(listing))}
                        listing={listing}
                    />
                ))}
            </section>
        )
    } else {
        return (
            <section className={cx({ [styles.center]: true, [styles.section]: true })}>
                <span>Inget resultat hittades för din sökning.</span>
            </section>
        )
    }
}

export default ListingGrid
