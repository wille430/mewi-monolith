import type {CreateUserWatcherDto} from '@/lib/modules/user-watchers/dto/create-user-watcher.dto'
import {AnyRecord} from '@/lib/types/utils'
import {array, boolean, number, object, string} from 'yup'
import {Category, ListingOrigin} from "@mewi/models"

export const MIN_PRICE_MSG = 'Måste vara större eller lika med 0'
export const MAX_PRICE_MSG = 'Talet är för stort'

export const createUserWatcherSchema = object().shape<AnyRecord<CreateUserWatcherDto['metadata']>>({
    auction: boolean(),
    categories: array().of(string().oneOf(Object.values(Category))),
    keyword: string(),
    origins: array().of(string().oneOf(Object.values(ListingOrigin))),
    priceRangeGte: number().min(0, MIN_PRICE_MSG).max(999999999999999, MAX_PRICE_MSG),
    priceRangeLte: number().min(0, MIN_PRICE_MSG).max(999999999999999, MAX_PRICE_MSG),
})
