import { IsMongoId, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { WatcherMetadata } from '@/schemas/class/WatcherMetadata'

export class CreateUserWatcherDto {
    @IsOptional()
    @IsMongoId()
    userId!: string

    @IsObject()
    @ValidateNested()
    @Type(() => WatcherMetadata)
    metadata!: WatcherMetadata
}
