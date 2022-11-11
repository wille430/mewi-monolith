import type { FindAllListingsDto } from '@/lib/modules/listings/dto/find-all-listing.dto'
import type { FindAllListingsReponse } from '@/lib/modules/listings/dto/find-all-listings-response.dto'
import { stringify } from 'query-string'
import { client } from '..'

export const getListings = (filters: FindAllListingsDto) => {
    return client.get<never, FindAllListingsReponse>('/listings?' + stringify(filters))
}
