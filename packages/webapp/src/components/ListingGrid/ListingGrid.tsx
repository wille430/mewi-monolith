import classNames from 'classnames'
import { useQueryClient } from 'react-query'
import { Listing } from '@mewi/prisma/index-browser'
import styles from './ListingGrid.module.scss'
import { ListingWidget } from '../ListingWidget/ListingWidget'
import StyledLoader from '../StyledLoader'
import { useListingFilters } from '@/hooks/useListingFilters'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { openListing } from '@/store/listings'

const cx = classNames.bind(styles)

const ListingGrid = () => {
    const { debouncedFilters } = useListingFilters()
    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()

    const { user } = useAppSelector((state) => state.user)
    const { data, isFetching, error } = queryClient.getQueryState<any>([
        'listings',
        debouncedFilters,
    ])
    const listings = data?.hits as Listing[]

    const handleLike = (id: string, action: 'like' | 'unlike') => {
        const oldListings = data.hits as Listing[]

        const listingIndex = oldListings.findIndex((x) => x.id === id)
        const listingToUpdate = oldListings.find((x) => x.id === id)
        const newHits = oldListings

        if (action === 'like' && !listingToUpdate.likedByUserIDs.includes(user?.id)) {
            listingToUpdate.likedByUserIDs.push(user?.id)
        } else {
            listingToUpdate.likedByUserIDs = listingToUpdate.likedByUserIDs.filter(
                (x) => x !== user?.id
            )
        }

        console.log({ listingToUpdate })

        newHits[listingIndex] = listingToUpdate

        const newData = {
            ...data,
            hits: newHits,
        }

        queryClient.setQueryData(['listings', debouncedFilters], newData)
    }

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
                        onLike={(id) => handleLike(id, 'like')}
                        onUnlike={(id) => handleLike(id, 'unlike')}
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
