import {AbstractListingParseStrategy} from "./AbstractListingParseStrategy";
import {Listing} from "@mewi/entities";
import {Category, Currency, ListingOrigin} from "@mewi/models";
import {WebScraper} from "../WebScraper";

export class BlippParseStrategy extends AbstractListingParseStrategy<
    Record<any, any>
> {
    constructor(webScraper: WebScraper<Listing>) {
        super(ListingOrigin.Blipp, webScraper);
    }

    parse(obj: Record<any, any>): Promise<Listing> | Listing {
        const {vehicle, published_date, cover_photo, entity_id, municipality} =
            obj;

        return {
            origin_id: this.conversions.origin_id.convert(
                `${(vehicle.brand as string).toLowerCase().slice(0, 16)}_${
                    vehicle.entity_id
                }`
            ),
            title: vehicle.car_name,
            category: Category.FORDON,
            date: new Date(published_date),
            imageUrl: cover_photo ? [cover_photo.full_path] : [],
            redirectUrl: `https://blipp.se/fordon/${entity_id}`,
            isAuction: false,
            price: vehicle.monthly_cost?.car_info_valuation
                ? {
                    value: parseFloat(
                        (vehicle.monthly_cost.car_info_valuation as string).replace(
                            " ",
                            ""
                        )
                    ),
                    currency: Currency.SEK,
                }
                : undefined,
            region: municipality?.name,
        } as Listing;
    }
}