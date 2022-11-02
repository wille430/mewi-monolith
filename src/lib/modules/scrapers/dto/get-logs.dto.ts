import { safeToDate } from '@/lib/utils/dateUtils'
import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'
import type { FilterQuery } from 'mongoose'
import { Pagination } from '../../database/dto/pagination.dto'
import type { ScrapingLog } from '../../schemas/scraping-log.schema'

export class GetLogsDto extends Pagination implements FilterQuery<ScrapingLog> {
    @IsDate()
    @Transform(({ value }) => safeToDate(value))
    createdAt?: Date
}
