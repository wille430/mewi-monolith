import { Type } from 'class-transformer'
import { IsObject, ValidateNested } from 'class-validator'
import { WatcherMetadata } from '../../schemas/class/WatcherMetadata'

export class CreateWatcherDto {
    @IsObject()
    @ValidateNested()
    @Type(() => WatcherMetadata)
    metadata!: WatcherMetadata
}
