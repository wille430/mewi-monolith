import { Listing } from '@/listings/listing.schema'
import { Category, ListingOrigins } from '@wille430/common'
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Min,
} from 'class-validator'

export class CreateListingDto implements Listing {
    id: string

    @IsString()
    title: string

    @IsString()
    body?: string

    @IsArray()
    @IsString({ each: true })
    @IsEnum(Category)
    category: Category[]

    @IsNumber()
    @Min(0)
    date: number

    @IsString()
    redirectUrl: string

    @IsString({ each: true })
    imageUrl: string[]

    // TODO: check object props
    @IsObject()
    @IsOptional()
    price?: {
        value: number
        currency: string
    }

    @IsString()
    region: string

    // TODO: check object props
    @IsArray()
    @IsObject({ each: true })
    parameters: { id: string; label: string; value: string }[]

    @IsEnum(ListingOrigins)
    origin: ListingOrigins

    @IsBoolean()
    @IsOptional()
    isAuction = false

    @IsOptional()
    endDate: number
}
