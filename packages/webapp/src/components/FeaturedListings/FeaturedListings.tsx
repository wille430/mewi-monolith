import { Container } from '@mewi/ui'
import style from './FeaturedListings.module.scss'
import { ListingWidget } from '@/components/ListingWidget/ListingWidget'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { likeListing, openListing, unlikeListing } from '@/store/listings'

export const FeaturedListings = () => {
    const dispatch = useAppDispatch()
    const { featured } = useAppSelector((state) => state.listings)
    const { user } = useAppSelector((state) => state.user)

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
                        {featured?.map((listing) => (
                            <ListingWidget
                                key={listing.id}
                                onClick={() => dispatch(openListing(listing))}
                                listing={listing}
                                onLike={() =>
                                    user &&
                                    dispatch(
                                        likeListing({ listingId: listing.id, userId: user.id })
                                    )
                                }
                                onUnlike={() =>
                                    user &&
                                    dispatch(
                                        unlikeListing({ listingId: listing.id, userId: user.id })
                                    )
                                }
                            />
                        ))}
                    </div>
                </>
            )}
        </Container>
    )
}
