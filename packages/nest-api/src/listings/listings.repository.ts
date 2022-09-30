import { EntityRepository } from '@/database/entity.repository'
import { Listing, ListingDocument } from '@/schemas/listing.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

export class ListingsRepository extends EntityRepository<ListingDocument> {
    constructor(@InjectModel(Listing.name) listingModel: Model<ListingDocument>) {
        super(listingModel)
    }
}
