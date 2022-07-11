import { FindAllListingsDto } from './dto/find-all-listing.dto'

export const MIN_SEARCH_SCORE = 1

export const LAST_PL_STAGES: (keyof FindAllListingsDto)[] = ['limit', 'page']
