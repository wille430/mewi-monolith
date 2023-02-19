import { client } from "../index";
import {ListingOrigin} from "@mewi/models";

export const getScrapersStatus = () => {
    return client.get<never, Record<ListingOrigin, any>>("/scrapers/status");
};
