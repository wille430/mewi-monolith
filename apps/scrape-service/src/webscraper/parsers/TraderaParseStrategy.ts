import {Listing} from "@mewi/entities";
import {AbstractListingParseStrategy} from "./AbstractListingParseStrategy";
import {Category, Currency, ListingOrigin} from "@mewi/models";
import {WebScraper} from "../WebScraper";
import {TraderaConfig} from "../config/TraderaContext"

export class TraderaParseStrategy extends AbstractListingParseStrategy<
    Record<any, any>
> {
    private readonly baseUrl: string;

    constructor(baseUrl: string, webScraper: WebScraper<any>) {
        super(ListingOrigin.Tradera, webScraper);

        if (baseUrl == null) throw new Error("baseUrl must be a non-null string");
        this.baseUrl = baseUrl;
    }

    public parse(obj: Record<any, any>): Promise<Listing> | Listing {
        return {
            origin_id: this.conversions.origin_id.convert(obj.itemId.toString()),
            title: obj.shortDescription,
            category: this.parseCategories(this.getCategory()),
            date: obj.startDate ? new Date(obj.startDate) : new Date(),
            auctionEnd: new Date(obj.endDate),
            imageUrl: [obj.imageUrl],
            isAuction: !!obj.endDate || obj.itemType === "auction",
            redirectUrl: new URL(obj.itemUrl, this.baseUrl).toString(),
            parameters: [],
            price: obj.price
                ? {
                    value: obj.price,
                    currency: Currency.SEK,
                }
                : undefined,
        } as Listing;
    }

    private parseCategories(href: string): Category {
        const title = TraderaConfig.categories.find((o) => o.href == href)?.title;
        switch (title) {
            case "Antikt & Design":
            case "Bygg & Verktyg":
            case "Konst":
            case "Trädgård & Växter":
                return Category.FOR_HEMMET;
            case "Datorer & Tillbehör":
            case "DVD & Videofilmer":
            case "Foto, Kameror & Optik":
            case "Hemelektronik":
            case "Musik":
            case "Telefoni, Tablets & Wearables":
            case "TV-spel & Datorspel":
                return Category.ELEKTRONIK;
            case "Fordon, Båtar & Delar":
                return Category.FORDON;
            case "Sport & Fritid":
            case "Hobby":
            case "Biljetter & Tidningar":
            case "Samlarsaker":
                return Category.FRITID_HOBBY;
            case "Övrigt":
            case "Rabattkoder":
            case "Vykort & Bilder":
                return Category.OVRIGT;
            default:
                return Category.PERSONLIGT;
        }
    }
}