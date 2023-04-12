import {Listing} from "@mewi/entities";
import {IStopScrapeStrategy} from "./StopScrapeStrategy";
import {ListingOrigin} from "@mewi/models";
import {max} from "lodash";

export class StopAtOldListingStrategy
    implements IStopScrapeStrategy<Listing[]> {
    private readonly origin: ListingOrigin;
    private oldDate: Date;
    private currentOldDate: Date;

    constructor(origin: ListingOrigin) {
        this.origin = origin;
    }

    indexOfLastValid(res: Listing[]): number | Promise<number> {
        return -1;
    }

    public async shouldStop(res: Listing[]): Promise<boolean> {
        if (this.oldDate == null) return false;
        return res.findIndex((listing) => listing.date <= this.currentOldDate) >= 0;
    }

    update(res: Listing[]): void | Promise<void> {
        this.oldDate = max([this.oldDate, ...res.map((o) => o.date)]);
    }

    start(): void | Promise<void> {
    }

    stop(): void | Promise<void> {
        this.currentOldDate = this.oldDate;
    }
}