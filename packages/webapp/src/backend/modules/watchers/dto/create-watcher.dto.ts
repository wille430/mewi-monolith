import { IsObject, ValidateNested } from 'class-validator'
import type { WatcherMetadata } from '../../schemas/class/WatcherMetadata'

export class CreateWatcherDto {
    @IsObject()
    @ValidateNested()
    metadata!: WatcherMetadata
}
