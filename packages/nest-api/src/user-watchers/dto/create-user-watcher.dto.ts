import { IsMongoId, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { OmitType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'

export class Metadata extends OmitType(FindAllListingsDto, ['page', 'limit', 'sort']) {}

export class CreateUserWatcherDto {
    @IsOptional()
    @IsMongoId()
    userId: string

    @IsObject()
    @ValidateNested()
    @Type(() => Metadata)
    metadata: Metadata
}