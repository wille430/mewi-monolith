import { Listing } from '@mewi/prisma'

export interface ListingsState {
    opened?: Listing
}

export enum ListingsActionTypes {
    OPEN_LISTING = 'listings/open',
    CLOSE_LISTING = 'listings/close',
}
