import { Container } from '@mewi/ui'
import { Listing } from '@mewi/prisma'
import style from './FeaturedListings.module.scss'
import { ListingWidget } from '@/components/ListingWidget/ListingWidget'
import { useAppDispatch } from '@/hooks'
import { openListing } from '@/store/listings'

const FeaturedListings = ({ listings }: { listings: Listing[] }) => {
    const dispatch = useAppDispatch()

    return (
        <Container className={style.container}>
            <h3>Produkter i blickfånget</h3>
            {listings.length === 0 ? (
                <span className={style.emptyText}>
                    Det finns inga produkter i blickfånget för tillfället
                </span>
            ) : (
                <>
                    <div className={style.scrollableView}>
                        {listings?.map((listing) => (
                            <ListingWidget
                                key={listing.id}
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

export default FeaturedListings
