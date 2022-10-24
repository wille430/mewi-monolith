import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { EntityRepository } from '@/database/entity.repository'
import type { UserWatcherDocument } from '@/schemas/user-watcher.schema'
import { UserWatcher } from '@/schemas/user-watcher.schema'

export class UserWatchersRepository extends EntityRepository<UserWatcherDocument> {
    constructor(@InjectModel(UserWatcher.name) userWatcherModel: Model<UserWatcherDocument>) {
        super(userWatcherModel)
    }
}
