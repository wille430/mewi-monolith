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
    priceRangeGte?: string | number

    @IsOptional()
    @IsNumberString()
    priceRangeLte?: string | number

    @IsOptional()
    @IsBooleanString()
    auction?: string | boolean

    @IsOptional()
    @IsNumberString()
    dateGte?: string | number

    @IsOptional()
    @IsNumberString()
    page?: string | number

    @IsOptional()
    sort?: Sort
}
