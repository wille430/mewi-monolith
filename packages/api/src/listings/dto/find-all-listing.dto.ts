import { SortData } from '@mewi/types'
import { IsOptional, IsString, IsNumberString, IsNumber, IsEnum } from 'class-validator'

export class FindAllListingsDto {
  @IsNumberString()
  @IsOptional()
  limit: string = '24'

  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  regions?: string[] | string

  @IsOptional()
  category?: string

  @IsOptional()
  @IsNumberString()
  priceRangeGte?: number | string

  @IsOptional()
  @IsNumberString()
  priceRangeLte?: number | string

  @IsOptional()
  auction?: boolean

  @IsOptional()
  dateGte?: number

  @IsOptional()
  @IsEnum(SortData)
  sort?: SortData
}
