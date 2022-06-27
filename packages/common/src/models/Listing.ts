import {
    Category,
    Listing as PrismaListing,
    ListingOrigin,
    Paramater,
    Price,
} from '@mewi/prisma/index'
import { Transform } from 'class-transformer'
import { IsBoolean, IsDate, IsEnum, IsObject, IsOptional, IsString } from 'class-validator'

export class Listing implements PrismaListing {
    @IsObject()
    price: Price | null

    @IsObject({ each: true })
    parameters: Paramater[]

    @IsString()
    id: string

    @IsString()
    origin_id: string

    @IsString()
    title: string

    @IsString()
    @IsOptional()
    body: string | null

    @IsEnum(Category)
    category: Category

    @IsDate()
    @Transform(({ value }) => new Date(value))
    date: Date

    @IsString()
    redirectUrl: string

    @IsString({ each: true })
    imageUrl: string[]

    @IsString()
    @IsOptional()
    region: string | null

    @IsEnum(ListingOrigin)
    origin: ListingOrigin

    @IsBoolean()
    isAuction: boolean

    @IsDate()
    @Transform(({ value }) => new Date(value))
    auctionEnd: Date | null

    @IsString({ each: true })
    likedByUserIDs: string[]
}

export class AlgoliaListing extends Listing {
    // Algolia specifics
    @Transform(({ obj }) => new Date(obj.date).getTime())
    date_numeric: number
}
