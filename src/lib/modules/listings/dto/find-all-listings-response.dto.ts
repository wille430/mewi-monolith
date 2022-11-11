import { IListing } from '@/common/schemas'
import type { FindAllListingsDto } from './find-all-listing.dto'

export class FindAllListingsReponse {
    filters!: FindAllListingsDto
    totalHits!: number
    hits!: IListing[]
}
