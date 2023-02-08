import { EntityRepository } from '../database/entity.repository'
import { EmailRecordModel } from '../schemas/email-record.schema'
import type { ListingDocument } from '../schemas/listing.schema'

export class EmailRecordsRepository extends EntityRepository<ListingDocument> {
    constructor() {
        super(EmailRecordModel as any)
    }
}
