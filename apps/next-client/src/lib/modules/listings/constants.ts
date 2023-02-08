import type { FindAllListingsDto } from './dto/find-all-listing.dto'

export const MIN_SEARCH_SCORE = 1

export const FIRST_PL_STAGES: (keyof FindAllListingsDto)[] = ['keyword']
export const LAST_PL_STAGES: (keyof FindAllListingsDto)[] = ['page', 'limit', 'sort']

export const DEFAULT_LIMIT = 36
