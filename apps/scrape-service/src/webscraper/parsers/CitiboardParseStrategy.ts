import {WebScraper} from "../WebScraper";
import {AbstractListingParseStrategy} from "./AbstractListingParseStrategy";
import {Category, Currency, ListingOrigin} from "@mewi/models";
import {Listing} from "@mewi/entities";
import {safeToDate} from "@mewi/utilities";

export class CitiboardParseStrategy extends AbstractListingParseStrategy<
    Record<any, any>
> {
    constructor(webScraper: WebScraper<any>) {
        super(ListingOrigin.Citiboard, webScraper);
    }

    parse(obj: Record<any, any>): Promise<Listing> | Listing {
        return {
            origin_id: this.conversions.origin_id.convert(obj.annons_id),
            title: obj.rubrik,
            category: Category.OVRIGT,
            date: safeToDate(obj.skapad) ?? new Date(),
            imageUrl: obj.thumb
                ? [
                    `https://citiboard-media.s3.eu-north-1.amazonaws.com/a/medium/${obj.thumb}`,
                ]
                : [],
            isAuction: false,
            redirectUrl: "https://citiboard.se/annons/" + obj.permalink,
            price: obj.pris
                ? {
                    value: parseInt(obj.pris),
                    currency: Currency.SEK,
                }
                : undefined,
        } as Listing;
    }
}