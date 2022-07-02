import classNames from 'classnames'
import styles from './ListingGrid.module.scss'
import { ListingWidget } from '../ListingWidget/ListingWidget'
import StyledLoader from '../StyledLoader'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { openListing } from '@/store/listings'

const cx = classNames.bind(styles)

const ListingGrid = () => {
    const dispatch = useAppDispatch()
    const { hits, isLoading, error } = useAppSelector((state) => state.listings.search)

    if (isLoading) {
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
    } else if (hits?.length) {
        return (
            <section className={styles.grid}>
                {hits.map((listing, i) => (
                    <ListingWidget
                        key={i}
                        onClick={() => dispatch(openListing(listing))}
                        data-testid={`listing-${i}`}
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
