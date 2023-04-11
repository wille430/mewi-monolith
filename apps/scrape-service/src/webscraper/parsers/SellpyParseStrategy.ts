import { AbstractListingParseStrategy } from "./AbstractListingParseStrategy";
import { Listing } from "@mewi/entities";
import { Category, Currency, ListingOrigin } from "@mewi/models";
import { WebScraper } from "../WebScraper";

export class SellpyParseStrategy extends AbstractListingParseStrategy<
  Record<any, any>
> {
  constructor(webScraper: WebScraper<Listing>) {
    super(ListingOrigin.Sellpy, webScraper);
  }

  parse(obj: Record<any, any>): Promise<Listing> | Listing {
    return {
      origin_id: this.conversions.origin_id.convert(obj.objectID),
      title: obj.metadata.brand ?? obj.metadata.type,
      category: Category.PERSONLIGT,
      date: obj.createdAt ? new Date(obj.createdAt * 1000) : new Date(),
      imageUrl: obj.images ?? [],
      isAuction: false,
      parameters: [],
      redirectUrl: `https://sellpy.com/item/${obj.objectID}`,
      price: obj.pricing?.amount
        ? {
            value: obj.pricing.amount,
            currency: Currency.SEK,
          }
        : undefined,
    } as Listing;
  }
}