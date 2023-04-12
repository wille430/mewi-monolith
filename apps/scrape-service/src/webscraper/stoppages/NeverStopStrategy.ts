import {IStopScrapeStrategy} from "./StopScrapeStrategy";

export class NeverStopStrategy implements IStopScrapeStrategy<any> {
    getStatusMsg(): string {
        return "No stoppage"
    }
    indexOfFirstInvalid(): number | Promise<number> {
        return -1;
    }

    shouldStop(): boolean | Promise<boolean> {
        return false;
    }

    update(res: any): void | Promise<void> {
    }

    start(): void | Promise<void> {
    }

    stop(): void | Promise<void> {
    }
}