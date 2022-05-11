import { IsInstance, IsMongoId, IsObject } from 'class-validator'
import { Watcher } from '@mewi/prisma'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'

export class CreateUserWatcherDto {
    @IsMongoId()
    userId: string

    @IsObject()
    @IsInstance(FindAllListingsDto)
    metadata: Watcher['metadata']
}
