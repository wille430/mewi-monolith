import type {FindAllListingsDto} from "@/lib/modules/listings/dto/find-all-listing.dto";
import {array, boolean, date, mixed, number, object, string} from "yup";
import {Category, ListingOrigin, ListingSort} from "@mewi/models";

export const searchListingsSchema = object().shape<Record<keyof FindAllListingsDto, any>>({
    auction: boolean(),
    categories: array(mixed().oneOf(Object.values(Category) as Category[])).ensure(),
    dateGte: date(),
    keyword: string(),
    limit: number().min(0),
    origins: array(mixed().oneOf(Object.values(ListingOrigin) as ListingOrigin[])).ensure(),
    page: number().min(1),
    priceRangeGte: number(),
    priceRangeLte: number(),
    region: string(),
    sort: mixed().oneOf(Object.values(ListingSort)),
});
