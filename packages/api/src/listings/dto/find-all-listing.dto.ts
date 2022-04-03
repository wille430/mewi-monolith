import { Sort } from '@mewi/common/types'
import { IsOptional, IsNumber, IsString, IsNumberString, IsBooleanString } from 'class-validator'

export class FindAllListingsDto {
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
    @IsNumberString()
    priceRangeGte?: string

    @IsOptional()
    @IsNumberString()
    priceRangeLte?: string

    @IsOptional()
    @IsBooleanString()
    auction?: string

    @IsOptional()
    @IsNumberString()
    dateGte?: string

    @IsOptional()
    @IsNumberString()
    page?: string

    @IsOptional()
    sort?: Sort
}
