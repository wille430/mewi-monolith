import { createAction } from '@reduxjs/toolkit'
import { Listing } from '@mewi/prisma'
import { ListingsActionTypes } from './types'

// TODO: allow Listing or ID as args, if ID fetch listing
export const openListing = createAction(ListingsActionTypes.OPEN_LISTING, (listing: Listing) => {
    return {
        payload: listing,
    }
})

export const closeListing = createAction(ListingsActionTypes.CLOSE_LISTING)
