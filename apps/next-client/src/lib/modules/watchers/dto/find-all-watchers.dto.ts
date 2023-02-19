import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FindAllWatchersDto {
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    limit?: string | number;
}
