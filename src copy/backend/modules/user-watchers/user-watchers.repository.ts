import { EntityRepository } from '../database/entity.repository'
import type { UserWatcherDocument } from '../schemas/user-watcher.schema'
import { UserWatcherModel } from '../schemas/user-watcher.schema'

export class UserWatchersRepository extends EntityRepository<UserWatcherDocument> {
    constructor() {
        super(UserWatcherModel as any)
    }
}
