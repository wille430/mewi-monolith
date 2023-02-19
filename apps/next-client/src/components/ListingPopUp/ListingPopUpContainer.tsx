"use client"
import dynamic from 'next/dynamic'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { closeListing } from '@/store/listings'

const DynamicListingPopUp = dynamic(() => import('./ListingPopUp'), { loading: () => null })

export const ListingPopUpContainer = () => {
    const listing = useAppSelector((state) => state.listings.opened)
    const dispatch = useAppDispatch()

    const handleClose = () => dispatch(closeListing())

    if (!listing) {
        return null
    }

    return <DynamicListingPopUp onClose={handleClose} listing={listing} />
}
