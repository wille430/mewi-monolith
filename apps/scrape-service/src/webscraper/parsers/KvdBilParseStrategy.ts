import { WebScraper } from "../WebScraper";
import { Listing } from "@mewi/entities";
import { AbstractListingParseStrategy } from "./AbstractListingParseStrategy";
import { Category, Currency, ListingOrigin } from "@mewi/models";

export class KvdBilParseStrategy extends AbstractListingParseStrategy<
  Record<any, any>
> {
  constructor(webScraper: WebScraper<Listing>) {
    super(ListingOrigin.Kvdbil, webScraper);
  }

  parse(obj: Record<any, any>): Promise<Listing> | Listing {
    return {
      origin_id: this.conversions.origin_id.convert(obj.id),
      title: obj?.processObject?.title,
      category: Category.FORDON,
      date: new Date(obj.openedAt ?? new Date()),
      imageUrl: obj.previewImages.map((o: any) => o.uri),
      redirectUrl: obj.auctionUrl,
      isAuction: obj.processObject.state === "AUCTION",
      price: obj.buyNowAmount
        ? {
            value: obj.buyNowAmount,
            currency: Currency.SEK,
          }
        : undefined,
    } as Listing;
  }
}