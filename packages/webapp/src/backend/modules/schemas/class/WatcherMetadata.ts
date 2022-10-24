import { PickType } from '@nestjs/mapped-types'
import { FindAllListingsDto } from '../../listings/dto/find-all-listing.dto'

// TODO: fix
export class WatcherMetadata extends PickType<FindAllListingsDto, keyof FindAllListingsDto>(
    FindAllListingsDto,
    ['keyword', 'auction', 'categories', 'origins', 'priceRangeGte', 'priceRangeLte', 'region']
) {}
