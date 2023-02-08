import { IsNumber } from 'class-validator'

export class Pagination {
    @IsNumber()
    limit?: number
    @IsNumber()
    skip?: number

    sort?: { [key: string]: -1 | 1 }

    // public get page(): number {
    //     if (this.skip && this.limit) {
    //         return this.skip / this.limit + 1
    //     } else {
    //         return 1
    //     }
    // }
}
