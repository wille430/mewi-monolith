import { ItemData } from '@mewi/types'

export interface ItemDisplayState {
    selectedItem?: ItemData
    isLoading: boolean
    error: string
}

export enum ItemDisplayActionTypes {
    GET_ITEM = 'itemDisplay/get',
    CLEAR_ITEM = 'itemDisplay/clear',
}
