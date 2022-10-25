import { IsMongoId, IsObject, IsOptional, ValidateNested } from 'class-validator'
import type { WatcherMetadata } from '../../schemas/class/WatcherMetadata'

export class CreateUserWatcherDto {
    @IsOptional()
    @IsMongoId()
    userId!: string

    @IsObject()
    @ValidateNested()
    metadata!: WatcherMetadata
}
