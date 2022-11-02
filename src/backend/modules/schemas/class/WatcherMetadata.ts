import { prop } from '@typegoose/typegoose'
import { Category, ListingOrigin } from '@/common/schemas'
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { FindAllListingsDto } from '../../listings/dto/find-all-listing.dto'

// TODO: fix
export class WatcherMetadata implements Partial<FindAllListingsDto> {
    @prop()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    keyword?: string

    @prop()
    @IsOptional()
    @IsBoolean()
    auction?: boolean

    @prop({
        enum: Category,
        type: [String],
        default: undefined,
    })
    @IsOptional()
    @IsEnum(Category, { each: true })
    categories?: Category[]

    @prop({
        enum: ListingOrigin,
        type: [String],
        default: undefined,
    })
    @IsOptional()
    @IsEnum(ListingOrigin, { each: true })
    origins?: ListingOrigin[]

    @prop()
    @IsOptional()
    @IsNumber()
    @Min(0)
    priceRangeGte?: number

    @prop()
    @IsOptional()
    @Min(0)
    priceRangeLte?: number

    @prop()
    @IsOptional()
    @IsString()
    region?: string
}
