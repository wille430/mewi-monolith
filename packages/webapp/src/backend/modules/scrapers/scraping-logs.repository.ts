import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { EntityRepository } from '@/database/entity.repository'
import type { ScrapingLogDocument } from '@/schemas/scraping-log.schema'
import { ScrapingLog } from '@/schemas/scraping-log.schema'

export class ScrapingLogsRepository extends EntityRepository<ScrapingLogDocument> {
    constructor(@InjectModel(ScrapingLog.name) scrapingLogModel: Model<ScrapingLogDocument>) {
        super(scrapingLogModel)
    }
}
