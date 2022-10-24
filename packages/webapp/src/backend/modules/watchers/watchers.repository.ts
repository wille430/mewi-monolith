import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { EntityRepository } from '@/database/entity.repository'
import type { WatcherDocument } from '@/schemas/watcher.schema'
import { Watcher } from '@/schemas/watcher.schema'

export class WatchersRepository extends EntityRepository<WatcherDocument> {
    constructor(@InjectModel(Watcher.name) watcherModel: Model<WatcherDocument>) {
        super(watcherModel)
    }
}
