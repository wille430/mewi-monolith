import { EntityRepository } from '../database/entity.repository'
import type { WatcherDocument } from '../schemas/watcher.schema'
import { WatcherModel } from '../schemas/watcher.schema'

export class WatchersRepository extends EntityRepository<WatcherDocument> {
    constructor() {
        super(WatcherModel as any)
    }
}
