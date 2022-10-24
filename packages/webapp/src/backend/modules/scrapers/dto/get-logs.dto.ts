import { safeToDate } from '@wille430/common'
import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'
import type { FilterQuery } from 'mongoose'
import type { ScrapingLog } from '@/schemas/scraping-log.schema'
import { Pagination } from '@/database/dto/pagination.dto'

export class GetLogsDto extends Pagination implements FilterQuery<ScrapingLog> {
    @IsDate()
    @Transform(({ value }) => safeToDate(value))
    createdAt?: Date
}
