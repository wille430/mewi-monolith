import { EntityRepository } from '@/database/entity.repository'
import { ScrapingLog, ScrapingLogDocument } from '@/schemas/scraping-log.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

export class ScrapingLogsRepository extends EntityRepository<ScrapingLogDocument> {
    constructor(@InjectModel(ScrapingLog.name) scrapingLogModel: Model<ScrapingLogDocument>) {
        super(scrapingLogModel)
    }
}
