import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { WatcherMetadata } from '@/schemas/class/WatcherMetadata'
import type { Watcher } from '@/schemas/watcher.schema'

export class CreateWatcherDto implements Partial<Watcher> {
    @ValidateNested()
    @Type(() => WatcherMetadata)
    metadata!: WatcherMetadata
}
