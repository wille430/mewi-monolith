import {Listing, ListingModel} from "@mewi/entities";
import {IStopScrapeStrategy} from "./StopScrapeStrategy";

export class StopAtExistingOriginIdStrategy
    implements IStopScrapeStrategy<Listing[]> {
    indexOfLastValid(res: Listing[]): number {
        return -1;
    }

    public async shouldStop(res: Listing[]): Promise<boolean> {
        const doc = await ListingModel.findOne({
            origin_id: {
                $in: res.map((o) => o.origin_id),
            },
        });

        return doc != null;
    }
}