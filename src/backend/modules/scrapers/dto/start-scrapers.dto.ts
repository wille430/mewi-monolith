import { ListingOrigin } from '@/common/schemas'
import { IsArray, IsEnum, IsOptional } from 'class-validator'

export class StartScrapersDto {
    @IsOptional()
    @IsArray()
    @IsEnum(ListingOrigin, { each: true })
    scrapers!: ListingOrigin[]
}
