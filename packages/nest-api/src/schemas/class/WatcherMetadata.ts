import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { PickType } from '@nestjs/mapped-types'
import { IWatcherMetadata } from '@wille430/common'

export class WatcherMetadata
    extends PickType(FindAllListingsDto, [
        'keyword',
        'auction',
        'categories',
        'origins',
        'priceRangeGte',
        'priceRangeLte',
        'region',
    ])
    implements IWatcherMetadata {}
