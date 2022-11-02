import style from './FeaturedListings.module.scss'
import { Container } from '../Container/Container'
import { ListingWidget } from '@/lib/components/ListingWidget/ListingWidget'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { openListing } from '@/lib/store/listings'

export const FeaturedListings = () => {
    const dispatch = useAppDispatch()
    const { featured } = useAppSelector((state) => state.listings)

    return (
        <Container className={style.container}>
            <h3>Produkter i blickfånget</h3>
            {featured.length === 0 ? (
                <span className={style.emptyText}>
                    Det finns inga produkter i blickfånget för tillfället
                </span>
            ) : (
                <>
                    <div className={style.scrollableView}>
                        {featured?.map((listing, i) => (
                            <ListingWidget
                                key={listing.id}
                                data-testid={`listing-${i}`}
                                onClick={() => dispatch(openListing(listing))}
                                listing={listing}
                            />
                        ))}
                    </div>
                </>
            )}
        </Container>
    )
}
