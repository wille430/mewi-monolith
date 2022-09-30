import { EntityRepository } from '@/database/entity.repository'
import { Watcher, WatcherDocument } from '@/schemas/watcher.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

export class WatchersRepository extends EntityRepository<WatcherDocument> {
    constructor(@InjectModel(Watcher.name) watcherModel: Model<WatcherDocument>) {
        super(watcherModel)
    }
}
