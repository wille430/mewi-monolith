import {Listing} from "@mewi/entities";
import {IStopScrapeStrategy} from "./StopScrapeStrategy";

export class StopAtExistingOriginIdStrategy
    implements IStopScrapeStrategy<Listing[]> {
    private readonly ids: Record<string, boolean>;

    constructor() {
        this.ids = {};
    }

    indexOfLastValid(res: Listing[]): number {
        return -1;
    }

    public async shouldStop(res: Listing[]): Promise<boolean> {
        for (const {origin_id} of res) {
            if (this.ids[origin_id]) {
                return true;
            }
        }
        return false;
    }

    update(res: Listing[]): void | Promise<void> {
        for (const {origin_id} of res) {
            this.ids[origin_id] = true;
        }
    }

    start(): void | Promise<void> {
    }

    stop(): void | Promise<void> {
    }
}