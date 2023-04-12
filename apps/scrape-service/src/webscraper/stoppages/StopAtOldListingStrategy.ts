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

    indexOfFirstInvalid(res: Listing[]): number | Promise<number> {
        if (this.currentOldDate == null) return -1;
        return res.findIndex((listing) => listing.date <= this.currentOldDate);
    }

    public async shouldStop(res: Listing[]): Promise<boolean> {
        return this.indexOfFirstInvalid(res) >= 0;
    }

    update(res: Listing[]): void | Promise<void> {
        this.oldDate = max([this.oldDate, ...res.map((o) => o.date)]);
    }

    start(): void | Promise<void> {
    }

    stop(): void | Promise<void> {
        this.currentOldDate = this.oldDate;
    }

    getStatusMsg(): string {
        return `Stopping at listings older than ${this.currentOldDate.toLocaleString()} next`;
    }
}