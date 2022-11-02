import { IsNumberString, IsOptional } from 'class-validator'

export class FindAllWatchersDto {
    @IsNumberString()
    @IsOptional()
    limit?: string | number
}
