import {Type} from 'class-transformer'
import {IsObject, ValidateNested} from 'class-validator'
import {WatcherMetadata} from '@mewi/entities'

export class CreateWatcherDto {
    @IsObject()
    @ValidateNested()
    @Type(() => WatcherMetadata)
    metadata!: WatcherMetadata
}
