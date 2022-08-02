import { ListingSearchFilters, ListingSort } from '@wille430/common'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, IsNumber, IsBoolean, IsDate, Min, IsEnum } from 'class-validator'
import { DEFAULT_LIMIT } from '../constants'

export class FindAllListingsDto implements ListingSearchFilters {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number.parseInt(value))
    @Min(0)
    limit = DEFAULT_LIMIT

    @IsOptional()
    @IsString()
    keyword?: string

    @IsOptional()
    @IsString()
    // TODO: transform
    region: string

    @IsOptional()
    @IsString()
    category?: string

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number.parseInt(value))
    priceRangeGte?: number

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number.parseInt(value))
    priceRangeLte?: number

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : Boolean(value)))
    auction?: boolean

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    dateGte?: Date

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number.parseInt(value))
    page?: number

    @IsOptional()
    @IsEnum(ListingSort)
    @Transform(({ value }) => Number.parseInt(value))
    sort?: ListingSort
}
