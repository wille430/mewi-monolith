import { Category } from '@/schemas/enums/Category'
import { Currency } from '@/schemas/enums/Currency'
import { ListingOrigin } from '@/schemas/enums/ListingOrigin'
import { Listing } from '@/schemas/listing.schema'
import { Transform } from 'class-transformer'
import { IsArray, IsBoolean, IsDate, IsEnum, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateListingDto implements Partial<Listing> {
    @IsString()
    origin_id!: string

    @IsString()
    title!: string

    @IsOptional()
    @IsString()
    body?: string

    @IsEnum(Category)
    category!: Category

    @Transform(({ value }) => new Date(value))
    @IsDate()
    date!: Date

    @IsString()
    redirectUrl!: string

    @IsString({ each: true })
    imageUrl!: string[]

    // TODO: check object props
    @IsOptional()
    @IsObject()
    price?: {
        value: number
        currency: Currency
    }

    @IsOptional()
    @IsString()
    region?: string

    // TODO: check object props
    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    parameters?: { label: string; value: string }[]

    @IsEnum(ListingOrigin)
    origin!: ListingOrigin

    @IsBoolean()
    @IsOptional()
    isAuction = false

    @IsOptional()
    @IsDate()
    auctionEnd?: Date

    @IsOptional()
    @IsString()
    entryPoint?: string
}
