import { Category, Currency, ListingOrigin, Prisma } from '@mewi/prisma'
import { IsArray, IsBoolean, IsDate, IsEnum, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateListingDto implements Prisma.ListingCreateInput {
    id!: string

    @IsString()
    origin_id!: string

    @IsString()
    title!: string

    @IsString()
    body!: string

    @IsArray()
    @IsString({ each: true })
    @IsEnum(Category)
    category!: Category

    @IsDate()
    date!: Date

    @IsString()
    redirectUrl!: string

    @IsString({ each: true })
    imageUrl!: string[]

    // TODO: check object props
    @IsObject()
    price!: {
        value: number
        currency: Currency
    }

    @IsString()
    region!: string

    // TODO: check object props
    @IsArray()
    @IsObject({ each: true })
    parameters!: { id: string; label: string; value: string }[]

    @IsEnum(ListingOrigin)
    origin!: ListingOrigin

    @IsBoolean()
    @IsOptional()
    isAuction = false

    @IsOptional()
    @IsDate()
    auctionEnd!: Date

    likedByUserIDs: string[] = []

    @IsOptional()
    @IsString()
    entryPoint!: string
}
