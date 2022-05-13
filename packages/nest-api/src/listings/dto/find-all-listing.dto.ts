import { ListingSearchFilters, ListingSort } from '@wille430/common'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, IsNumber, IsBoolean, IsDate, Min, IsEnum } from 'class-validator'

export class FindAllListingsDto implements ListingSearchFilters {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number.parseInt(value))
    @Min(0)
    limit = 24

    @IsOptional()
    @IsString()
    keyword?: string

    @IsOptional()
    @IsString({ each: true })
    // TODO: transform
    regions: string[]

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
    @Transform(({ value }) => value === 'true')
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
