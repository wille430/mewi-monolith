import {Cheerio} from "cheerio";
import {Currency, ListingOrigin} from "@mewi/models";
import {Listing} from "@mewi/entities";
import {AbstractListingParseStrategy} from "./AbstractListingParseStrategy";
import {WebScraper} from "../WebScraper";

export class BytbilParseStrategy extends AbstractListingParseStrategy<
    Cheerio<any>
> {
    private baseUrl: string;

    constructor(baseUrl: string, webScraper: WebScraper<any>) {
        super(ListingOrigin.Bytbil, webScraper);
        this.baseUrl = baseUrl;
    }

    public parse(ele: Cheerio<any>): Listing {
        const href = ele.find(".car-list-header > a")?.attr("href");
        const priceString = ele.find(".car-price-main")?.text()?.replace(/\D/g, "");

        const imageEle = ele.find("div.car-image");
        const imageUrl = imageEle
            .attr("style")
            .match(/background-image: url\((.*)\)/)
            ?.at(1);

        return {
            origin_id: this.conversions.origin_id.convert(
                ele.find(".uk-grid")?.attr("data-model-id")
            ),
            title: ele.find(".car-list-header > a")?.text(),
            imageUrl: imageUrl ? [imageUrl] : [],
            isAuction: false,
            redirectUrl: href ? new URL(href, this.baseUrl).toString() : this.baseUrl,
            price: priceString
                ? {
                    value: parseInt(priceString),
                    currency: Currency.SEK,
                }
                : undefined,
            date: new Date(),
            category: this.conversions.category.convert(this.getCategory()),
        } as Listing;
    }
}