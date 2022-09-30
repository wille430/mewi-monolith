import { WatcherMetadata } from '@/schemas/class/WatcherMetadata'
import { Watcher } from '@/schemas/watcher.schema'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class CreateWatcherDto implements Partial<Watcher> {
    @ValidateNested()
    @Type(() => WatcherMetadata)
    metadata!: WatcherMetadata
}
