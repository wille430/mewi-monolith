import type { Model } from 'mongoose'
import { inject } from 'tsyringe'
import { EntityRepository } from '../database/entity.repository'
import type { ListingDocument} from '../schemas/listing.schema'
import { ListingModel } from '../schemas/listing.schema'

export class ListingsRepository extends EntityRepository<ListingDocument> {
    constructor(@inject(ListingModel) listingModel: Model<ListingDocument>) {
        super(listingModel)
    }
}
