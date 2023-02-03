import type { FindAllListingsDto } from './find-all-listing.dto'
import {ListingDto} from "@/common/dtos/ListingDto"

export class FindAllListingsReponse {
    filters!: FindAllListingsDto
    totalHits!: number
    hits!: ListingDto[]
}
