import { IsInstance, IsObject } from 'class-validator'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { IWatcher, ListingSearchFilters } from '@mewi/common/types'

export class CreateWatcherDto implements Partial<IWatcher> {
    @IsObject()
    @IsInstance(FindAllListingsDto)
    metadata: ListingSearchFilters
}
