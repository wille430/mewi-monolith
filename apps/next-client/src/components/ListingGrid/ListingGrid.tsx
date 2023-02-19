import {ListingWidget} from '../ListingWidget/ListingWidget'
import StyledLoader from '../StyledLoader'
import {useAppDispatch} from '@/hooks'
import {openListing} from '@/store/listings'
import {useListingsSearch} from '@/hooks/useListingsResult'

const ListingGrid = () => {
    const dispatch = useAppDispatch()
    const {data, error} = useListingsSearch()
    const {hits} = data ?? {}

    if (data == null) {
        return (
            <section
                className="centered"
                style={{
                    minHeight: "60vh"
                }}
            >
                <StyledLoader/>
            </section>
        )
    } else if (error) {
        return (
            <section className="centered">
                <span>Ett fel inträffade</span>
            </section>
        )
    } else if (hits?.length) {
        return (
            <section style={{
                minHeight: "60vh"
            }}>
                <div className="center-x">
                    <div className="max-w-screen-lg flex flex-wrap gap-4 mx-auto
                                after:block after:flex-grow-[999]">
                        {hits.map((listing, i) => (
                            <ListingWidget
                                key={listing.id}
                                onClick={() => dispatch(openListing(listing))}
                                data-testid={`listing-${i}`}
                                listing={listing}
                            />
                        ))}
                    </div>
                </div>
            </section>
        )
    } else {
        return (
            <section className="centered" style={{
                minHeight: "60vh"
            }}>
                <span className="text-muted">Inga resultat hittades för din sökning</span>
            </section>
        )
    }
}

export default ListingGrid
