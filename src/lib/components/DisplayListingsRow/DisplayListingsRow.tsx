import style from './DisplayListingsRow.module.scss'
import {Container} from '../Container/Container'
import {ListingWidget} from '@/lib/components/ListingWidget/ListingWidget'
import {openListing} from '@/lib/store/listings'
import {ListingDto} from "@/common/dtos/ListingDto"
import {useAppDispatch} from "@/lib/hooks"

interface DisplayListingsRowParams {
    listings?: ListingDto[],
    title?: string,
    showMoreHref?: string,
}

export const DisplayListingsRow = (params: DisplayListingsRowParams) => {
    const dispatch = useAppDispatch()
    const {listings, title, showMoreHref} = params

    return (
        <Container className={style.container}>
            <div className="flex justify-between">
                <h4>{title}</h4>
                {showMoreHref && <a href={showMoreHref}>
                    <span>Visa mer ${"==>"}</span>
                </a>}
            </div>
            {listings == null || listings.length === 0 ? (
                <span className={style.emptyText}>
                    Det finns inga produkter i blickfånget för tillfället
                </span>
            ) : (
                <>
                    <div className={style.scrollableView}>
                        {listings?.map((listing, i) => (
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
