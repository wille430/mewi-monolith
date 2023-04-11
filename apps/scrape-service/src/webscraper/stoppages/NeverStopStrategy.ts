import {IStopScrapeStrategy} from "./StopScrapeStrategy";

export class NeverStopStrategy implements IStopScrapeStrategy<any> {
    indexOfLastValid(res: any): number | Promise<number> {
        return -1;
    }

    shouldStop(res: any): boolean | Promise<boolean> {
        return false;
    }
}