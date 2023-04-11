import {AbstractListingParseStrategy} from "./AbstractListingParseStrategy";
import {WebScraper} from "../WebScraper";
import {Category, Currency, ListingOrigin} from "@mewi/models";
import {Listing} from "@mewi/entities";

export class ShpockParseStrategy extends AbstractListingParseStrategy<
    Record<any, any>
> {
    constructor(webScraper: WebScraper<any>) {
        super(ListingOrigin.Shpock, webScraper);
    }

    parse(obj: Record<any, any>): Promise<Listing> | Listing {
        return {
            origin_id: this.conversions.origin_id.convert(obj.id),
            title: obj.title,
            body: obj.descrpition,
            // TODO: fix category
            // category: await this.parseCategory(item.category[0]),
            category: Category.OVRIGT,
            date: new Date(),
            imageUrl: obj.media.map(
                (o: any) => `https://webimg.secondhandapp.at/w-i-m/${o.id}`
            ),
            redirectUrl: obj.canonicalURL,
            isAuction: false,
            price: obj.price
                ? {
                    value: obj.price,
                    currency: Currency.SEK,
                }
                : undefined,
        } as Listing;
    }
}