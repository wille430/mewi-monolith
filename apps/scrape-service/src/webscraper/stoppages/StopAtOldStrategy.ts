import {Listing} from "@mewi/entities";
import {IStopScrapeStrategy} from "./StopScrapeStrategy";

export class StopAtOldStrategy implements IStopScrapeStrategy<Listing[]> {
    private readonly oldDate: Date;

    constructor(oldDate: Date) {
        this.oldDate = oldDate;
    }

    indexOfLastValid(res: Listing[]): number | Promise<number> {
        return -1;
    }

    shouldStop(res: Listing[]): boolean | Promise<boolean> {
        return res.findIndex((listing) => listing.date <= this.oldDate) > 0;
    }
}