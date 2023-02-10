import {EntityRepository} from '../database/entity.repository'
import type {ScrapingLogDocument} from '../schemas/scraping-log.schema'
import {ScrapingLogModel} from '../schemas/scraping-log.schema'

export class ScrapingLogsRepository extends EntityRepository<ScrapingLogDocument> {
    constructor() {
        super(ScrapingLogModel as any)
    }
}
