import type { FindAllListingsDto } from './find-all-listing.dto'
import {ListingDto} from "@mewi/models"

export class FindAllListingsReponse {
    filters!: FindAllListingsDto
    totalHits!: number
    hits!: ListingDto[]
}
