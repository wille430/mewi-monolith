import { IsInstance, IsMongoId, IsObject } from 'class-validator'
import { Metadata } from '@/watchers/watcher.schema'
import { Watcher } from '@prisma/client'

export class CreateUserWatcherDto {
    @IsMongoId()
    userId: string

    @IsObject()
    @IsInstance(Metadata)
    metadata: Watcher['metadata']
}
