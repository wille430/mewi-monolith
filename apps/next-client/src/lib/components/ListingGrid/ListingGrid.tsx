import styles from './ListingGrid.module.scss'
import {ListingWidget} from '../ListingWidget/ListingWidget'
import StyledLoader from '../StyledLoader'
import {useAppDispatch} from '@/lib/hooks'
import {openListing} from '@/lib/store/listings'
import {useListingsSearch} from '@/lib/hooks/useListingsResult'
import clsx from 'clsx'

const ListingGrid = () => {
    const dispatch = useAppDispatch()
    const {data, error} = useListingsSearch()
    const isLoading = !data
    const {hits} = data ?? {}

    if (isLoading) {
        return (
            <section
                className={clsx({
                    [styles.center]: true,
                })}
                style={{
                    minHeight: "60vh"
                }}
            >
                <StyledLoader/>
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
            <section style={{
                minHeight: "60vh"
            }}>
                <div className={styles.grid}>
                    {hits.map((listing, i) => (
                        <ListingWidget
                            key={listing.id}
                            onClick={() => dispatch(openListing(listing))}
                            data-testid={`listing-${i}`}
                            listing={listing}
                        />
                    ))}
                </div>
            </section>
        )
    } else {
        return (
            <section className={clsx(styles.center, styles.section)} style={{
                minHeight: "60vh"
            }}>
                <span>Inget resultat hittades för din sökning.</span>
            </section>
        )
    }
}

export default ListingGrid
