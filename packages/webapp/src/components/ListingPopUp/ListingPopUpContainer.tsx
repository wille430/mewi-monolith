import { useAppDispatch, useAppSelector } from '@/hooks'
import { closeListing } from '@/store/listings'
import dynamic from 'next/dynamic'

const DynamicListingPopUp = dynamic(() => import('./ListingPopUp'))

export const ListingPopUpContainer = () => {
    const listing = useAppSelector((state) => state.listings.opened)
    const dispatch = useAppDispatch()

    const handleClose = () => dispatch(closeListing())

    if (!listing) {
        return null
    }

    return <DynamicListingPopUp onClose={handleClose} listing={listing} />
}
