import {Listing} from "@mewi/entities";
import {IConversionStrategy} from "../conversions/ConversionStrategy";
import {ListingOrigin} from "@mewi/models";
import {IParseStrategy} from "./ParseStrategy";
import {GuessCategoryConversionStrategy} from "../conversions/GuessCategoryConversionStrategy";
import {OriginIdConversionStrategy} from "../conversions/OriginIdConversionStrategy";
import {WebScraper} from "../WebScraper";

export abstract class AbstractListingParseStrategy<T>
    implements IParseStrategy<T, Listing> {
    protected conversions: Partial<Record<keyof Listing, IConversionStrategy>> = {
        origin_id: null,
        category: null,
    };
    private webScraper: WebScraper<Listing>;

    protected constructor(
        origin: ListingOrigin,
        webScraper: WebScraper<Listing>,
        conversions: Partial<Record<keyof Listing, IConversionStrategy>> = {}
    ) {
        Object.assign(this.conversions, conversions);

        if (this.conversions.category == null)
            this.conversions.category = new GuessCategoryConversionStrategy();
        if (this.conversions.origin_id == null)
            this.conversions.origin_id = new OriginIdConversionStrategy(origin);

        this.webScraper = webScraper;
    }

    protected getCategory() {
        return this.webScraper.getConfig().getIdentifier();
    }

    abstract parse(obj: T): Promise<Listing> | Listing;

    parseAll(objs: T[]): Promise<Listing[]> | Listing[] {
        return Promise.all(objs.map((o) => this.parse(o)));
    }
}