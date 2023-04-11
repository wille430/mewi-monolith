import { AbstractListingParseStrategy } from "./AbstractListingParseStrategy";
import { Cheerio } from "cheerio";
import { parseCurrency } from "../../utils/parseCurrency";
import { Category, Currency, ListingOrigin } from "@mewi/models";
import { Listing } from "@mewi/entities";
import { WebScraper } from "../WebScraper";

export class BilwebParseStrategy extends AbstractListingParseStrategy<
  Cheerio<any>
> {
  private readonly baseUrl: string;

  constructor(baseUrl: string, webScraper: WebScraper<Listing>) {
    super(ListingOrigin.Bilweb, webScraper);
    this.baseUrl = baseUrl;
  }

  parse(ele: Cheerio<any>): Promise<Listing> | Listing {
    const imageEle = ele.find("img.goToObject");
    const imageUrl = imageEle?.attr("data-src") ?? imageEle.attr("src");
    const priceString = ele.find(".Card-mainPrice")?.text();
    const redirectPath = ele.find(".Card-heading a")?.attr("href");

    return {
      origin_id: this.conversions.origin_id.convert(ele.attr("id") as any),
      title: ele.find(".Card-heading")?.text(),
      imageUrl: imageUrl ? [imageUrl] : undefined,
      isAuction: false,
      redirectUrl: redirectPath
        ? new URL(redirectPath, this.baseUrl).toString()
        : this.baseUrl,
      price: priceString
        ? {
            value: parseCurrency(priceString),
            currency: Currency.SEK,
          }
        : undefined,
      category: Category.FORDON,
      date: new Date(),
    } as Listing;
  }
}