import { Category } from "./ListingCategory";
import { Currency } from "./Currency";
import { ListingOrigin } from "./ListingOrigin";

export interface ListingDto {
  id: string;
  title: string;
  body?: string;
  category: Category;
  date: Date;
  redirectUrl: string;
  imageUrl: string[];
  price?: {
    value: number;
    currency: Currency;
  };
  region?: string;
  parameters?: { label: string; value: string }[];
  origin: ListingOrigin;
  isAuction: boolean;
  auctionEnd?: Date;
}