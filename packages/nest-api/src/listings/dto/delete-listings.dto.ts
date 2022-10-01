import { PickType } from '@nestjs/mapped-types'
import { FindAllListingsDto } from './find-all-listing.dto'

export class DeleteListingsDto extends PickType(FindAllListingsDto, [
    'auction',
    'origins',
    'categories',
]) {}
