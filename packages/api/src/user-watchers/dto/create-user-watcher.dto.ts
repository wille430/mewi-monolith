import { IsInstance, IsMongoId, IsObject } from 'class-validator'
import { Metadata } from '@/watchers/watcher.schema'
import { ListingSearchFilters } from '@wille430/common/types'

export class CreateUserWatcherDto {
    @IsMongoId()
    userId: string

    @IsObject()
    @IsInstance(Metadata)
    metadata: ListingSearchFilters
}
