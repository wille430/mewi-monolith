import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    IsUrl
} from "class-validator"
import {Category, Currency, ListingOrigin} from "@mewi/models"

export class ListingValidator {
    @IsString()
    title: string

    @IsString()
    @IsOptional()
    body?: string

    @IsEnum(Category)
    category: Category

    @IsDate()
    date: Date

    @IsString()
    @IsUrl()
    redirectUrl: string

    @IsArray()
    @IsUrl({}, {
        each: true
    })
    imageUrl: string[]

    @IsOptional()
    price?: {
        value: number
        currency: Currency
    }

    @IsString()
    @IsOptional()
    region?: string

    @IsArray()
    @IsOptional()
    parameters?: { label: string; value: string }[]

    @IsEnum(ListingOrigin)
    origin: ListingOrigin

    @IsBoolean()
    isAuction: boolean

    @IsDate()
    @IsOptional()
    auctionEnd?: Date
}
