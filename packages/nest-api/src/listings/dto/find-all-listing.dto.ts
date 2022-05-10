import { ListingSort } from '@/common/types/listingSort'
import { Watcher } from '@mewi/prisma'
import {
    IsOptional,
    IsString,
    IsNumberString,
    IsBooleanString,
    IsDateString,
} from 'class-validator'

type Metadata = Watcher['metadata']

export class FindAllListingsDto implements Partial<Metadata> {
    @IsOptional()
    @IsNumberString()
    limit = '24'

    @IsOptional()
    @IsString()
    keyword: string | null

    @IsOptional()
    regions: string[]

    @IsOptional()
    category?: string

    @IsOptional()
    @IsNumberString()
    priceRangeGte?: number

    @IsOptional()
    @IsNumberString()
    priceRangeLte?: number

    @IsOptional()
    @IsBooleanString()
    auction?: boolean

    @IsOptional()
    @IsDateString()
    dateGte?: Date

    @IsOptional()
    @IsNumberString()
    page?: string | number

    @IsOptional()
    sort?: ListingSort
}
