import {IsNumber} from 'class-validator'

export class Pagination {
    @IsNumber()
    limit?: number
    @IsNumber()
    skip?: number

    sort?: { [key: string]: -1 | 1 }
}
