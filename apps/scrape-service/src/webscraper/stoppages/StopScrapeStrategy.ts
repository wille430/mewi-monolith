export interface IStopScrapeStrategy<T> {
  shouldStop(res: T): boolean | Promise<boolean>;

  indexOfLastValid(res: T): number | Promise<number>;
}

