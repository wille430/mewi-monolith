import styles from './ListingGrid.module.scss'
import classNames from 'classnames'
import { ListingSearchFilters } from '@wille430/common'
import { Listing } from '@wille430/common'
import { ListingWidget } from '../ListingWidget/ListingWidget'

const cx = classNames.bind(styles)

const NON_DEBOUNCED_FILTERS: (keyof ListingSearchFilters)[] = ['category', 'page']

interface ListingGridProps {
    listings: Listing[]
}

const ListingGrid = ({ listings }: ListingGridProps) => {
    // if (isLoading || isFetching || shouldFetch) {
    //     return (
    //         <section
    //             className={cx({
    //                 [styles.center]: true,
    //             })}
    //         >
    //             <StyledLoader />
    //         </section>
    //     )
    // } else if (error) {
    //     return (
    //         <section className={styles.center}>
    //             <span>Ett fel inträffade</span>
    //         </section>
    //     )
    // } else {
    if (listings?.length) {
        return (
            <section className={styles.grid}>
                {listings.map((listing) => (
                    <ListingWidget listing={listing} />
                ))}
            </section>
        )
    } else {
        return (
            <section className={cx({ [styles.center]: true })}>
                <span>Inga resultat hittades för din sökning.</span>
            </section>
        )
    }
    // }
}

export default ListingGrid
