import {prop} from "@typegoose/typegoose"
import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min,} from "class-validator"
import {Transform} from "class-transformer"
import {Category, ListingOrigin, WatcherMetadataDto} from "@mewi/models"

// TODO: fix
export class WatcherMetadata {
  @prop()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value : undefined))
  keyword?: string;

  @prop()
  @IsOptional()
  @IsBoolean()
  auction?: boolean;

  @prop({
    enum: Category,
    type: [String],
    default: undefined,
  })
  @IsOptional()
  @IsEnum(Category, { each: true })
  categories?: Category[];

  @prop({
    enum: ListingOrigin,
    type: [String],
    default: undefined,
  })
  @IsOptional()
  @IsEnum(ListingOrigin, { each: true })
  origins?: ListingOrigin[];

  @prop()
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceRangeGte?: number;

  @prop()
  @IsOptional()
  @Min(0)
  priceRangeLte?: number;

  @prop()
  @IsOptional()
  @IsString()
  region?: string;

  public static convertToDto(obj: WatcherMetadata): WatcherMetadataDto {
    return {
      auction: obj.auction,
      categories: obj.categories,
      keyword: obj.keyword,
      origins: obj.origins,
      region: obj.region,
      priceRangeGte: obj.priceRangeGte,
      priceRangeLte: obj.priceRangeLte,
    };
  }
}
