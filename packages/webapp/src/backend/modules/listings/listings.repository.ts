import { EntityRepository } from '../database/entity.repository'
import type { ListingDocument } from '../schemas/listing.schema'
import { ListingModel } from '../schemas/listing.schema'

export class ListingsRepository extends EntityRepository<ListingDocument> {
    constructor() {
        super(ListingModel as any)
    }
}
