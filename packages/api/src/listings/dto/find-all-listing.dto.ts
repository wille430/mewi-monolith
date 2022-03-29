import { SearchFilterDataProps } from '@mewi/common/types'
import { IsOptional, IsNumber, IsString } from 'class-validator'

export class FindAllListingsDto implements SearchFilterDataProps {
    @IsOptional()
    @IsNumber()
    limit = 24

    @IsOptional()
    @IsString()
    keyword?: string

    @IsOptional()
    regions?: string[] | string

    @IsOptional()
    category?: string

    @IsOptional()
    @IsNumber()
    priceRangeGte?: number

    @IsOptional()
    @IsNumber()
    priceRangeLte?: number

    @IsOptional()
    auction?: boolean

    @IsOptional()
    dateGte?: number
}
