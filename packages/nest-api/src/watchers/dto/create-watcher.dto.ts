import { IsInstance } from 'class-validator'
import { Watcher } from '@mewi/prisma'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'

export class CreateWatcherDto implements Partial<Watcher> {
    @IsInstance(FindAllListingsDto)
    metadata!: Watcher['metadata']
}
