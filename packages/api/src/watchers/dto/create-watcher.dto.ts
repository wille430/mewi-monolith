import { IsInstance, IsObject } from "class-validator"
import { FindAllListingsDto } from "listings/dto/find-all-listing.dto"

export class CreateWatcherDto {
  @IsObject()
  @IsInstance(FindAllListingsDto)
  metadata: typeof FindAllListingsDto
}
