import { Container } from '@mewi/ui'
import { ListingWidget } from '@/components/ListingWidget/ListingWidget'
import style from './FeaturedListings.module.scss'
import { Listing } from '@wille430/common'

const FeaturedListings = ({ listings }: { listings: Listing[] }) => {
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
                        {listings?.map((x) => (
                            <ListingWidget key={x.id} listing={x} />
                        ))}
                    </div>
                </>
            )}
        </Container>
    )
}

export default FeaturedListings
