import {IStopScrapeStrategy} from "./StopScrapeStrategy";

export class NeverStopStrategy implements IStopScrapeStrategy<any> {
    indexOfLastValid(): number | Promise<number> {
        return -1;
    }

    shouldStop(): boolean | Promise<boolean> {
        return false;
    }
}