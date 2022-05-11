import { ListingSearchFilters, ListingSort } from '@wille430/common'
import { Transform } from 'class-transformer'
import { IsOptional, IsString, IsNumber, IsBoolean, IsDate, Min } from 'class-validator'

export class FindAllListingsDto implements ListingSearchFilters {
    @IsOptional()
    @IsNumber()
    @Transform((val) => Number.parseInt(val as any))
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
    @Transform((val) => Number.parseInt(val as any))
    priceRangeGte?: number

    @IsOptional()
    @IsNumber()
    @Transform((val) => Number.parseInt(val as any))
    priceRangeLte?: number

    @IsOptional()
    @IsBoolean()
    @Transform((val) => (val as any) === 'true')
    auction?: boolean

    @IsOptional()
    @IsDate()
    @Transform((val) => new Date(val as any))
    dateGte?: Date

    @IsOptional()
    @IsNumber()
    @Transform((val) => Number.parseInt(val as any))
    page?: number

    @IsOptional()
    sort?: ListingSort
}
