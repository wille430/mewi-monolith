import { IsObject } from 'class-validator'
import { Watcher } from '@prisma/client'

export class CreateWatcherDto implements Partial<Watcher> {
    @IsObject()
    metadata: Watcher['metadata']
}
