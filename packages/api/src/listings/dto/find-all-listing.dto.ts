import { Sort } from '@wille430/common'
import { IsOptional, IsString, IsNumberString, IsBooleanString } from 'class-validator'

export class FindAllListingsDto {
    @IsOptional()
    @IsNumberString()
    limit = '24'

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
