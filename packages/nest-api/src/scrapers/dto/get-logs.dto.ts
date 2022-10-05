import { Pagination } from '@/database/dto/pagination.dto'
import { ScrapingLog } from '@/schemas/scraping-log.schema'
import { safeToDate } from '@wille430/common'
import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'
import { FilterQuery } from 'mongoose'

export class GetLogsDto extends Pagination implements FilterQuery<ScrapingLog> {
    @IsDate()
    @Transform(({ value }) => safeToDate(value))
    createdAt?: Date
}
