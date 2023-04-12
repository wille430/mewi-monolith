import {Listing} from "@mewi/entities";
import {IStopScrapeStrategy} from "./StopScrapeStrategy";

export class StopAtExistingOriginIdStrategy
    implements IStopScrapeStrategy<Listing[]> {
    private readonly ids: Record<string, boolean>;

    constructor() {
        this.ids = {};
    }

    indexOfFirstInvalid(res: Listing[]): number {
        const ids = Object.keys(this.ids);
        return res.findIndex((o) => ids.includes(o.origin_id));
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

    getStatusMsg(): string {
        return `Stopping when listing origin_id matches one of ${
            Object.keys(this.ids).length
        } origin_ids`;
    }
}