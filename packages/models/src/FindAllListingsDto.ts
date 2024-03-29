import {Transform} from 'class-transformer'
import {
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
    IsDate,
    Min,
    IsEnum,
    IsArray,
} from 'class-validator'
import {IPagination} from "./IPagination"
import {Category} from "./ListingCategory"
import {isString} from "lodash"
import {ListingSort} from "./ListingSort"
import {ListingOrigin} from "./ListingOrigin"

export class FindAllListingsDto implements IPagination {

    public static DefaultLimit = 36

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => Number.parseInt(value))
    @Min(0)
    limit? = FindAllListingsDto.DefaultLimit

    @IsOptional()
    @IsString()
    keyword?: string

    @IsOptional()
    @IsString()
        // TODO: transform
    region?: string

    @IsOptional()
    @IsArray()
    @IsEnum(Category, {each: true})
    @Transform(({value}) => (isString(value) ? value.split(',') : value))
    categories?: Category[]

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => Number.parseInt(value))
    priceRangeGte?: number

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => Number.parseInt(value))
    priceRangeLte?: number

    @IsOptional()
    @IsBoolean()
    @Transform(({value}) => (typeof value === 'string' ? value === 'true' : Boolean(value)))
    auction?: boolean

    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    dateGte?: Date

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => Number.parseInt(value))
    page?: number

    @IsOptional()
    @IsEnum(ListingSort)
    @Transform(({value}) => Number.parseInt(value))
    sort?: ListingSort

    @IsOptional()
    @IsArray()
    @IsEnum(ListingOrigin, {each: true})
    @Transform(({value}) => (isString(value) ? value.split(',') : value))
    origins?: ListingOrigin[]
}
