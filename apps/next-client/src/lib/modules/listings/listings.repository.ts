import {EntityRepository} from '../database/entity.repository'
import {ListingModel, ListingDocument} from '@mewi/entities'

export class ListingsRepository extends EntityRepository<ListingDocument> {
    constructor() {
        super(ListingModel as any)
    }
}
