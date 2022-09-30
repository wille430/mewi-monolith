import { EntityRepository } from '@/database/entity.repository'
import { Listing, ListingDocument } from '@/schemas/listing.schema'
import { UserWatcher, UserWatcherDocument } from '@/schemas/user-watcher.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

export class UserWatchersRepository extends EntityRepository<UserWatcherDocument> {
    constructor(@InjectModel(UserWatcher.name) userWatcherModel: Model<UserWatcherDocument>) {
        super(userWatcherModel)
    }
}
